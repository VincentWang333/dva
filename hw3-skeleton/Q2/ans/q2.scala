// Databricks notebook source
// STARTER CODE - DO NOT EDIT THIS CELL
import org.apache.spark.sql.functions.desc
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import spark.implicits._
import org.apache.spark.sql.expressions.Window

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
spark.conf.set("spark.sql.legacy.timeParserPolicy","LEGACY")

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
val customSchema = StructType(Array(StructField("lpep_pickup_datetime", StringType, true), StructField("lpep_dropoff_datetime", StringType, true), StructField("PULocationID", IntegerType, true), StructField("DOLocationID", IntegerType, true), StructField("passenger_count", IntegerType, true), StructField("trip_distance", FloatType, true), StructField("fare_amount", FloatType, true), StructField("payment_type", IntegerType, true)))

// COMMAND ----------

// STARTER CODE - YOU CAN LOAD ANY FILE WITH A SIMILAR SYNTAX.
val df = spark.read
   .format("com.databricks.spark.csv")
   .option("header", "true") // Use first line of all files as header
   .option("nullValue", "null")
   .schema(customSchema)
   .load("/FileStore/tables/nyc_tripdata.csv") // the csv file which you want to work with
   .withColumn("pickup_datetime", from_unixtime(unix_timestamp(col("lpep_pickup_datetime"), "MM/dd/yyyy HH:mm")))
   .withColumn("dropoff_datetime", from_unixtime(unix_timestamp(col("lpep_dropoff_datetime"), "MM/dd/yyyy HH:mm")))
   .drop($"lpep_pickup_datetime")
   .drop($"lpep_dropoff_datetime")

// COMMAND ----------

// LOAD THE "taxi_zone_lookup.csv" FILE SIMILARLY AS ABOVE. CAST ANY COLUMN TO APPROPRIATE DATA TYPE IF NECESSARY.
// ENTER THE CODE BELOW
val taxi_zone_customSchema = StructType(Array(StructField("LocationID", IntegerType, true),
                                    StructField("Borough", StringType, true),
                                    StructField("Zone", StringType, true),
                                    StructField("service_zone", StringType, true)))
val taxi_zone_df = spark.read
   .format("com.databricks.spark.csv")
   .option("header", "true") // Use first line of all files as header
   .option("nullValue", "null")
   .schema(taxi_zone_customSchema)
   .load("/FileStore/tables/taxi_zone_lookup.csv") // the csv file which you want to work with

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
// Some commands that you can use to see your dataframes and results of the operations. You can comment the df.show(5) and uncomment display(df) to see the data differently. You will find these two functions useful in reporting your results.
// display(df)
// df.show(5) // view the first 5 rows of the dataframe
// display(taxi_zone_df)

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
// Filter the data to only keep the rows where "PULocationID" and the "DOLocationID" are different and the "trip_distance" is strictly greater than 2.0 (>2.0).

// VERY VERY IMPORTANT: ALL THE SUBSEQUENT OPERATIONS MUST BE PERFORMED ON THIS FILTERED DATA

val df_filter = df.filter($"PULocationID" =!= $"DOLocationID" && $"trip_distance" > 2.0)
// df_filter.show(5)

// COMMAND ----------

// PART 1a: The top-5 most popular drop locations - "DOLocationID", sorted in descending order - if there is a tie, then one with lower "DOLocationID" gets listed first
// Output Schema: DOLocationID int, number_of_dropoffs int 

// Hint: Checkout the groupBy(), orderBy() and count() functions.

// ENTER THE CODE BELOW
var a = df_filter.groupBy("DOLocationID").count().sort(col("count").desc, col("DOLocationID").asc).withColumnRenamed("count","number_of_dropoffs").limit(5)
// a.show()

// COMMAND ----------

// PART 1b: The top-5 most popular pickup locations - "PULocationID", sorted in descending order - if there is a tie, then one with lower "PULocationID" gets listed first 
// Output Schema: PULocationID int, number_of_pickups int

// Hint: Code is very similar to part 1a above.

// ENTER THE CODE BELOW
var b = df_filter.groupBy("PULocationID").count().sort(col("count").desc, col("PULocationID").asc).withColumnRenamed("count","number_of_pickups").limit(5)
// b.show()

// COMMAND ----------

// PART 2: List the top-3 locations with the maximum overall activity, i.e. sum of all pickups and all dropoffs at that LocationID. In case of a tie, the lower LocationID gets listed first.
// Output Schema: LocationID int, number_activities int

// Hint: In order to get the result, you may need to perform a join operation between the two dataframes that you created in earlier parts (to come up with the sum of the number of pickups and dropoffs on each location). 

// ENTER THE CODE BELOW
var all_dropoff = df_filter.groupBy("DOLocationID").count().sort(col("count").desc, col("DOLocationID").asc).withColumnRenamed("count","number_of_dropoffs")
var all_pickup = df_filter.groupBy("PULocationID").count().sort(col("count").desc, col("PULocationID").asc).withColumnRenamed("count","number_of_pickups")
var all_acitivities = all_dropoff.join(all_pickup, all_dropoff("DOLocationID") === all_pickup("PULocationID"), "outer").withColumn("LocationID",when(col("DOLocationID").isNull,col("PULocationID")).otherwise(col("DOLocationID"))).na.fill(value=0, Array("number_of_dropoffs", "number_of_pickups")).withColumn("number_activities", col("number_of_dropoffs") + col("number_of_pickups")).select($"LocationID", $"number_activities").sort(col("number_activities").desc).limit(3)
// display(all_acitivities)

// COMMAND ----------

// PART 3: List all the boroughs in the order of having the highest to lowest number of activities (i.e. sum of all pickups and all dropoffs at that LocationID), along with the total number of activity counts for each borough in NYC during that entire period of time.
// Output Schema: Borough string, total_number_activities int

// Hint: You can use the dataframe obtained from the previous part, and will need to do the join with the 'taxi_zone_lookup' dataframe. Also, checkout the "agg" function applied to a grouped dataframe.

// ENTER THE CODE BELOW
var drop_off = df_filter.groupBy("DOLocationID").count().sort(col("count").desc, col("DOLocationID").asc).withColumnRenamed("count","number_of_dropoffs")
var pick_up = df_filter.groupBy("PULocationID").count().sort(col("count").desc, col("PULocationID").asc).withColumnRenamed("count","number_of_pickups")
var all_activities = drop_off.join(pick_up, drop_off("DOLocationID") === b("PULocationID"), "outer").withColumn(
  "LocationID", when(col("DOLocationID").isNull, col("PULocationID")).otherwise(col("DOLocationID"))).na.fill(
  value=0, Array("number_of_dropoffs", "number_of_pickups")).withColumn("total_number_activities", col("number_of_dropoffs") + col("number_of_pickups")).select(
  $"LocationID", $"total_number_activities")

var a = all_activities.join(taxi_zone_df, all_activities("LocationID") === taxi_zone_df("LocationID"), "outer").select(
  $"Borough",$"total_number_activities").groupBy("Borough").sum(
  "total_number_activities").withColumnRenamed(
  "sum(total_number_activities)","total_number_activities").sort(
  col("total_number_activities").desc)


// display(a)

// COMMAND ----------

// PART 4: List the top 2 days of week with the largest number of (daily) average pickups, along with the values of average number of pickups on each of the two days. The day of week should be a string with its full name, for example, "Monday" - not a number 1 or "Mon" instead.
// Output Schema: day_of_week string, avg_count float

// Hint: You may need to group by the "date" (without time stamp - time in the day) first. Checkout "to_date" function.

// ENTER THE CODE BELOW
var a = df_filter.withColumn("date", to_date(col("pickup_datetime"))).groupBy("date").count().withColumn("day_of_week", date_format(col("date"), "EEEE")).groupBy("day_of_week").avg("count").withColumnRenamed(
  "avg(count)","avg_count").sort(col("avg_count").desc).limit(2)
// display(a)

// COMMAND ----------

// PART 5: For each particular hour of a day (0 to 23, 0 being midnight) - in their order from 0 to 23, find the zone in Brooklyn borough with the LARGEST number of pickups. 
// Output Schema: hour_of_day int, zone string, max_count int

// Hint: You may need to use "Window" over hour of day, along with "group by" to find the MAXIMUM count of pickups

// ENTER THE CODE BELOW
var a = df_filter.withColumn("hour_of_day", hour(col("pickup_datetime"))).select($"PULocationID", $"hour_of_day")
var b = a.join(taxi_zone_df, taxi_zone_df("LocationID") === a("PULocationID"), "outer").filter($"Borough" === "Brooklyn" ).groupBy("hour_of_day", "Zone").count()
var window = Window.partitionBy("hour_of_day").orderBy(col("count").desc)
var c = b.withColumn("row",row_number.over(window)).where($"row" === 1).drop("row")
// display(c)



// COMMAND ----------

// PART 6 - Find which 3 different days of the January, in Manhattan, saw the largest percentage increment in pickups compared to previous day, in the order from largest increment % to smallest increment %. 
// Print the day of month along with the percent CHANGE (can be negative), rounded to 2 decimal places, in number of pickups compared to previous day.
// Output Schema: day int, percent_change float


// Hint: You might need to use lag function, over a window ordered by day of month.

// ENTER THE CODE BELOW
var a = df_filter.withColumn("date", to_date(col("pickup_datetime"))).withColumn("month", month(col("date"))).withColumn("year", year(col("date"))).filter($"month"===1).withColumn("day", date_format(col("date"), "d").cast(IntegerType)).filter($"month"===1)
var b = a.join(taxi_zone_df, taxi_zone_df("LocationID") === a("PULocationID")).select("LocationID", "Borough", "date", "month", "year", "day").filter($"Borough" === "Manhattan").groupBy("month", "day", "year").count()
// display(b)
var window  = Window.partitionBy("month", "year").orderBy(col("day"))
var c = b.withColumn("previous_count",lag("count",1).over(window)).withColumn("percent_change", round((col("count")-col("previous_count"))/col("previous_count")*100, 2)).orderBy(col("percent_change").desc).select("day", "percent_change")
// display(c)
