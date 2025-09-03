# Stage 1: Use a specific, official Maven image with OpenJDK 21
FROM maven:3.9-openjdk-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


# Stage 2: Use the most common, official slim image for OpenJDK 21
FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]