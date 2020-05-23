# Load library
library(dplyr)

# Get data from data.world
mom_2020w14 <- read.csv("https://query.data.world/s/f7tarmnf7pafmzypgdaagw52pjqobz")

# Filter for USA
us_results <- filter(mom_2020w14,Country == "United States of America")

# Reduce, reorder and rename columns
us_results <- us_results[,c(1,3,6,5,8,7)]
names(us_results) <- tolower(names(us_results))
names(us_results)[4] <- 'time_use'
names(us_results)[6] <- 'avg_time_hours'

# Write results to csv for d3
write.csv(us_results,"mom_2020w14_us_results.csv",row.names = FALSE)