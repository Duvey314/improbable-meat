# Improbable Meat

This project is the implementation of a web server for participants of a study on belly button bacteria. Participants can visit the website, select their ID number from a self-populating dropdown menu, and view key statistics of their results.

![gitpage](https://github.com/Duvey314/improbable-meat/blob/master/gitpage.PNG)

### Plotly

There are three plotly graphs used in the dashboard.

The first is a bar chart to display the top ten bacterial samples found by quantity. To do this the sample array was transposed to make sorting by one array simple. A slice was then taken to get the top ten and the array was then transposed again to display the results.

The second chart is an indicator used to show the frequency of belly button washing. The number below the frequency is the difference from the average frequency of 2.5. This average is dynamically generated at load.

The last chart is a bubble chart that shows the number of samples found for each bacteria type. The size and location of the bubbles is based on the sample size. When hovering over the bubble, the types of bacteria pop up.
