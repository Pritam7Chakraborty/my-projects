# Stage 1: Build the application using a verified Maven image that includes JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


# Stage 2: Create the final image using a slim JDK 21 runtime
FROM eclipse-temurin:21-jdk-slim

WORKDIR /app

# Copy the executable .jar file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]