import pandas as pd
import numpy as np

def calculate_demographic_data(print_data=True):
    # Read data from file
    df = pd.read_csv('adult.data.csv')

    # How many people of each race are represented?
    race_count = df['race'].value_counts()

    # What is the average age of men?
    average_age_men = round(df[df['sex'] == 'Male']['age'].mean(), 1)

    # What is the percentage of people who have a Bachelor's degree?
    percentage_bachelors = round(len(df[df['education'] == 'Bachelors']) / len(df) * 100, 1)

    # What percentage of people with advanced education make more than 50K?
    # What percentage of people without advanced education make more than 50K?
    higher_education = df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])
    
    higher_education_rich = round(
        len(df[higher_education & (df['salary'] == '>50K')]) / 
        len(df[higher_education]) * 100, 1)
    
    lower_education_rich = round(
        len(df[~higher_education & (df['salary'] == '>50K')]) / 
        len(df[~higher_education]) * 100, 1)

    # What is the minimum number of hours a person works per week?
    min_work_hours = df['hours-per-week'].min()

    # What percentage of the people who work the minimum number of hours per week have a salary of >50K?
    num_min_workers = df[df['hours-per-week'] == min_work_hours]
    
    rich_percentage = round(
        len(num_min_workers[num_min_workers['salary'] == '>50K']) / 
        len(num_min_workers) * 100, 1)

    # What country has the highest percentage of people that earn >50K?
    country_stats = df[['native-country', 'salary']].groupby('native-country').apply(
        lambda x: round(len(x[x['salary'] == '>50K']) / len(x) * 100, 1)
    ).sort_values(ascending=False)
    
    highest_earning_country = country_stats.index[0]
    highest_earning_country_percentage = country_stats.iloc[0]

    # Identify the most popular occupation for those who earn >50K in India
    india_df = df[(df['native-country'] == 'India') & (df['salary'] == '>50K')]
    top_IN_occupation = india_df['occupation'].value_counts().index[0]

    if print_data:
        print("Number of each race:\n", race_count) 
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage': highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }