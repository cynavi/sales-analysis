Spring Batch will require the following beans from us to process the data from the Excel to the database:

ItemReader: To read the Excel rows.
ItemProcessor (Optional): To perform any intermediate processing in the POJO object. At this step, we can sanitize or
validate the data, and even return a completely new object accepted by the batch writer.
ItemWriter: To write the data into the database.
Step: Defines which reader, processor, and writer are part of the whole process. We can define multiple Step beans if
there are more things to do such as sending notifications. Ideally, each step must perform a unique responsibility.
Job: Defines which step(s) are part of the report. It can define multiple steps in a single report.
All the beans are created in a @Configuration class so they are automatically registered with the application context.