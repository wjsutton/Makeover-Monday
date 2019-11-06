# Makeover Monday Week 19, 2019
[Back to Index page](../README.md)

---

<p align="centre">
  <a href="" rel="noopener">
 <img width=300px height=200px src="https://raw.githubusercontent.com/wjsutton/Makeover-Monday/master/2019w19/mlb_home_run_bar_chart_race.gif" alt="Project logo"></a>
</p>

## Table of Contents
- [About](#about)
- [Workflow](#workflow)
- [Contact](#contact)

## About <a name = "about"></a>
What's Makeover Monday? Find out here: [https://www.makeovermonday.co.uk](https://www.makeovermonday.co.uk)

This week's Makeover Monday involved Major League Baseball homerun hitters from 1985 to 2016.

The project can be found here: [https://www.makeovermonday.co.uk/data/](https://www.makeovermonday.co.uk/data/)
Dataset here: [https://data.world/makeovermonday/2019w19](https://data.world/makeovermonday/2019w19)
And group write up here: [https://www.makeovermonday.co.uk/week-19-2019/](https://www.makeovermonday.co.uk/week-19-2019/)

Twitter had been alive with animated bar charts and while opinions were up in the air as to whether this a good data viz or not, they certainly attract plenty of attention and keep users engaged, for example:
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">New project:<br> <br>A “Bar Chart Race” animation showing the changing ranks of the 10 biggest cities in the world since 1500.<br><br>Fascinating to watch giant cities vanish after falling in conquests, and amazing that three UK cities were in the top 8 in the late 1800s. <a href="https://t.co/KglMZbYobr">pic.twitter.com/KglMZbYobr</a></p>&mdash; John Burn-Murdoch (@jburnmurdoch) <a href="https://twitter.com/jburnmurdoch/status/1107552367795412992?ref_src=twsrc%5Etfw">March 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

So I decided to work out how to create my own. 

## Workflow <a name = "workflow"></a>
These instructions will recreate an animated bar chart race from scratch using the MLB data set. You can either use the steps below or run the script [mlb_chart_build.R](https://github.com/wjsutton/Makeover-Monday/blob/master/2019w19/mlb_chart_build.R) locally 

### Prerequisites

For this visualisation you will need R installed and the require packages to run the script [mlb_chart_build.R](https://github.com/wjsutton/Makeover-Monday/blob/master/2019w19/mlb_chart_build.R) 

Packages can be installed by
```
install.packages(c("gganimate","janitor","gifski","dplyr","zoo"), dependencies = TRUE)
```
Verify these have installed correctly with 
```
library(gganimate)
library(janitor)
library(gifski)
library(dplyr)
library(zoo)
```

### Loading the Data

The dataset is available as a csv online, so we don't need to download it locally, we can read the data in to the dataframe "df" using read.csv()
```
df <- read.csv("https://query.data.world/s/u3stzqkmghigjrrzio7vyfzch4gqe5", header=TRUE, stringsAsFactors=FALSE)
```

### TO DO: Transforming the Data

To make an animated bar chart we will need to alter our data "df" to go from this: 

To this:

Where the columns blah will be used for this and that

### TO DO: Building the Chart

Lastly save the gif with anim_save()

```
anim_save("mlb_home_run_bar_chart_race.gif", anim)
```

And tada, one bar chart race created

![MM Week 19, 2019](https://raw.githubusercontent.com/wjsutton/Makeover-Monday/master/2019w19/mlb_home_run_bar_chart_race.gif)

## 👋 Contact <a name = "contact"></a>
If you have any questions about the work in this repo feel free to raise an issue or contact me on Twitter via [@wjsutton12](https://twitter.com/wjsutton12)
