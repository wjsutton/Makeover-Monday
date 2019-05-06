### Makeover Monday Week 19 2019
### Bar Chart Race Gif

# Load Libraries
library(gganimate)
library(janitor)
library(gifski)
library(dplyr)
library(zoo)
theme_set(theme_classic())

# Load Dataset
df <- read.csv("https://query.data.world/s/u3stzqkmghigjrrzio7vyfzch4gqe5", header=TRUE, stringsAsFactors=FALSE)

# Prepare Dataset
top_10_homerunners <- clean_names(df)
top_10_homerunners <- top_10_homerunners[,c('player_id','player_name','season','team','hr')]
  
top_10_homerunners <- top_10_homerunners %>% 
          group_by(player_id,player_name,season) %>%
          mutate(team = paste(team, collapse="/"))

top_10_homerunners <- top_10_homerunners %>% 
  group_by(player_id,player_name,season,team) %>%
  summarise(hr = sum(hr))

# Creating data so each player has every season associated with them in the data
for(i in 1985:2016){
  missing_data <- data.frame(unique((top_10_homerunners %>% filter(season != i))[,c('player_id','player_name')]),season=i,team=NA,hr=0)
  if(i == 1985){
    missing_df <- missing_data 
  }
  if(i != 1985){
    missing_df <- rbind(missing_df,missing_data)
  }
}

# Merge to existing dataset
top_10_homerunners <- rbind(as.data.frame(top_10_homerunners),missing_df)
top_10_homerunners <- top_10_homerunners %>% arrange(player_id,season)
top_10_homerunners$team <- c(rep('San Francisco Giants',19),na.locf(top_10_homerunners$team))

top_10_homerunners <- top_10_homerunners %>% 
  group_by(player_id,player_name,season,team) %>%
  summarise(hr = sum(hr))

# Calculate running sum of home runs
p <- top_10_homerunners  %>%
  arrange(season) %>%
  group_by(player_id) %>%
  mutate(career_hrs = cumsum(hr))

p2 <- p %>%
  group_by(season) %>%
  mutate(rank = rank(-career_hrs)) %>% 
  arrange(season,-career_hrs) 

# Find the top 10 and top 1 values for 
p3 <- top_n(p2,10,career_hrs)
p3_top1 <- top_n(p2,1,career_hrs)
p3_top1 <- unique(p3_top1[,c('season','career_hrs')])
names(p3_top1) <- c('season','total_hrs')

# Manually filter out ties at rank 10 
p3$id <- paste0(p3$player_id,p3$season)
p3 <- p3 %>% filter(!id %in% c('evansdw011987','mcgrifr011992','deerro011993','galaran011997','davisch011997'))
p3$bar_rank <- rep(c(1:10),32)

# Join Top 10 and Top 1 datasets and calculate relative weighting
p4 <- inner_join(p3,p3_top1, by = c("season" = "season"))
p4$Value_rel <- p4$career_hrs/p4$total_hrs
{as.character(p4$season)}
# Buid plot
p5 <- ggplot(p4, aes(bar_rank, season, player_name)) +
  geom_tile(aes(y = Value_rel/2, height = Value_rel,width = 0.9), color = NA) +
  geom_text(aes(y = Value_rel, label = paste(player_name, " ")), vjust = -0.5, hjust = 1, size = 5, color = "white") +
  geom_text(aes(y = Value_rel, label = paste(team, " ")), vjust = 0.7, hjust = 1, size = 4, color = "white") +
  geom_text(aes(y=Value_rel,label = paste0(" ",round(career_hrs,0)), hjust=0.1), size = 5) +
  geom_text(aes(10, 1),label = {as.character(p4$season)}, size = 20, hjust = 0, vjust = -0.2,color = "grey") +
  coord_flip(clip = "off", expand = FALSE) +
  scale_x_reverse() +
  ylim(0, 1.3) +
  guides(color = FALSE, fill = FALSE) +
  labs(title = 'Top 10 MLB Home Run Hitters, 1985-{closest_state}'
       ,subtitle = "Note: excludes players were salary data is not available."
       ,x = element_blank()
       ,y = 'Home Runs since 1985'
       ,caption = 'Author: @WJSutton12, Data: Lahman's Baseball Database') +
  theme(plot.title = element_text(hjust = 0, size = 24),
        plot.subtitle = element_text(hjust = 0, size = 12),
        plot.caption = element_text(vjust = 0.3, size = 12),
        axis.ticks.y = element_blank(),  
        axis.text.y  = element_blank(),  
        axis.ticks.x = element_blank(), 
        axis.text.x  = element_blank(),
        axis.title.x = element_text(size = 12),
        panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        axis.line = element_line(colour = "black"),
        plot.margin = margin(1,1,1,1, "cm")) +
  transition_states(season, transition_length = 4, state_length = 1) +
  ease_aes('cubic-in-out')
anim <- animate(p5,200, duration = 40, width = 700, height = 500,start_pause=3, end_pause=10)  

anim_save("mlb_home_run_bar_chart_race.gif", anim)
