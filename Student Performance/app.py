import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("data/student_performance_dataset.csv")

#1 BASIC SHAPE & TYPES
print(df.shape)
print("")
print(df.dtypes)
print("")
print(df.isnull().sum())

#2. Statistical summary
print(df.describe)

#3. Correlation heatmap 
plt.figure(figsize=(8,6))
sns.heatmap(df.drop(columns = "student_id").corr(),
            annot=True, cmap="coolwarm", fmt=".2f"
            )
plt.title("Feature Correlation with final score: ")
plt.show()

#4. Scatter: study hours vs final score
sns.scatterplot(data=df, x="study_hours_per_week", y="final_score")
plt.show