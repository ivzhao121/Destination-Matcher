library(dplyr)
hotels <- read.csv("CIS4500/Hotels.csv", header=TRUE)
# Extract the features for the hotels in separate cols
sub_hotels <- hotels %>%
  mutate(
    info1 = str_trim(info1),
    info2 = str_trim(info2),
    free_wifi = ifelse(info1 =="Free Wifi" | info2 =="Free Wifi" | info3 =="Free Wifi" | info4 =="Free Wifi" | info5 =="Free Wifi" | info6 =="Free Wifi" | info7 =="Free Wifi" |
                         info1 =="Free Internet" | info2 =="Free Internet" | info3 =="Free Internet" | info4 =="Free Internet" | info5 =="Free Internet" | info6 =="Free Internet" | info7 =="Free Internet", 1, 0),
    free_parking = ifelse(info1 == "Free parking" | info2 == "Free parking" | info3 == "Free parking" | info4 == "Free parking" | info5 == "Free parking" | info6 == "Free parking" | info7 == "Free parking", 1, 0),
    pool = ifelse(info1 == "Pool" | info2 == "Pool" | info3 == "Pool" | info4 == "Pool" | info5 == "Pool" | info6 == "Pool" | info7 == "Pool",1,0),
    spa = ifelse(info1 == "Spa" | info2 == "Spa" | info3 == "Spa" | info4 == "Spa" | info5 == "Spa" | info6 == "Spa" | info7 == "Spa",1,0),
    beach = ifelse(info1 == "Beach" | info2 == "Beach" | info3 == "Beach" | info4 == "Beach" | info5 == "Beach" | info6 == "Beach" | info7 == "Beach",1,0),
    restaurant = ifelse(info1 == "Restaurant" | info2 == "Restaurant" | info3 == "Restaurant" | info4 == "Restaurant" | info5 == "Restaurant" | info6 == "Restaurant" | info7 == "Restaurant",1,0),
    fitness_center = ifelse(info1 == "Fitness center" | info2 == "Fitness center" | info3 == "Fitness center" | info4 == "Fitness center" | info5 == "Fitness center" | info6 == "Fitness center" | info7 == "Fitness center",1,0),
    bar_lounge = ifelse(info1 == "Bar/Lounge" | info2 == "Bar/Lounge" | info3 == "Bar/Lounge" | info4 == "Bar/Lounge" | info5 == "Bar/Lounge" | info6 == "Bar/Lounge" | info7 == "Bar/Lounge",1,0),
    room_service = ifelse(info1 == "Room service" | info2 == "Room service" | info3 == "Room service" | info4 == "Room service" | info5 == "Room service" | info6 == "Room service" | info7 == "Room service",1,0)
  ) %>%
  select(name, continent, city, country, price, rating, free_wifi,
         free_parking, pool, spa, beach, restaurant,
         fitness_center, bar_lounge, room_service)

# Get countries from hotels
countries <- hotels %>%
  select(country, continent) %>%
  distinct(country, .keep_all = TRUE)

sub_hotel_data <- hotel_data %>%
  mutate(
    country = str_trim(country),
    city = str_trim(city),
  )

sub_country_data <- country_data %>%
  mutate(
    country = str_trim(country),
    continent = str_trim(continent)
  ) %>%
  select(country, continent)

city_temp <- read.csv("CIS4500/city_temperature.csv",header=TRUE)
sub_city_temp <- city_temp %>%
  mutate(
    Region = ifelse(Region == "Australia/South Pacific", "South Pacific", ifelse(Region == "South/Central America & Carribean", "South America", Region))
  ) %>%
  select(City, Country, Region, Month, Day, Year, AvgTemperature)
fwrite(sub_city_temp, "CIS4500/clean/Temperatures.csv")

more_countries <- sub_city_temp %>%
  select(Country, Region) %>%
  distinct(Country, .keep_all = TRUE)
fwrite(more_countries, "CIS4500/clean/More_Countries.csv")