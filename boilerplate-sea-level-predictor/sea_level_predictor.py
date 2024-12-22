import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Load data
    df = pd.read_csv('epa-sea-level.csv')

    # Create scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(df['Year'], df['CSIRO Adjusted Sea Level'], label='Data Points')

    # First regression line (all data)
    slope, intercept, r_value, p_value, std_err = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
    years_extended = pd.Series(range(1880, 2051))
    line = intercept + slope * years_extended
    plt.plot(years_extended, line, 'r', label='Best Fit Line (1880-2050)')

    # Second regression line (from 2000)
    df_recent = df[df['Year'] >= 2000]
    slope_recent, intercept_recent, _, _, _ = linregress(df_recent['Year'], df_recent['CSIRO Adjusted Sea Level'])
    years_recent = pd.Series(range(2000, 2051))
    line_recent = intercept_recent + slope_recent * years_recent
    plt.plot(years_recent, line_recent, 'g', label='Best Fit Line (2000-2050)')

    # Add labels, title, and legend
    plt.xlabel('Year')
    plt.ylabel('Sea Level (inches)')
    plt.title('Rise in Sea Level')
    plt.legend()

    # Save and return plot
    plt.savefig('sea_level_plot.png')
    return plt.gca()