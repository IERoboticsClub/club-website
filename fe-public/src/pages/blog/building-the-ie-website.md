---
layout: '../../layouts/Blog.astro'
title: Building a website for the Robotics and AI Club
---

# Unveiling the Secrets Behind the IE Robotics and AI Club: Math, Leaderboard Stack, and SEO/UI/UX Insights

## Introduction
- A brief overview of what readers can expect from the blog post.

## The Math Behind the Waves and Word Cloud
### By @i-be-keggles
The matrix-esque random character backgrounds were a theme we wanted to use prevalently throughout the website, and can be seen in the wave function we use as a header, and the word cloud holding the projects. The character animation itself is just a simple random sample uniformly pulled from a predefined list of the basic alphanumeric characters along with some special symbols we thought would look good in the components, but the math behind *where* we render the characters is a little more interesting. The basic method is a specific function for defining target length for a string of characters in the component, and then applying some gaussian distortion to blur the edges and make it a bit more dynamic.

The wave effect was achieved by layering sin waves on top of each other similar to how many water simulations are built. The function is as follows: for each column of characters going down the screen, the length of that string is defined as
`l + a * sin((x + d)/t) + sin((x + d/2)/(t*1.5)) * a/2 + sin((x + d/3)/(t*2)) * a/2`
where l is length, a is amplitude, p is period, d is offset, and x is the column.
The hardcoded values in the second and third sin functions are to add variation to the layers.
To animate the wave, the offest, d, is increased over time to "scroll" the wave across the screen. For the wave to loop infinitely without needing to worry about errors with large numbers, the offset is also reset when it reaches the period of the entire length function, so that the wave can flow seamlessly and our variables are kept in a manageable range.

The word cloud is simpler. It's defined as two grids of characters, one has smaller cells and is used for the background, the other has larger cells and displays the words. The words are randomly positioned via a normal distribution. The function to define the area of the background is a simple eliptical radius, with the distance of the cell from the center (in the background grid) fed into the blur function. Said distance is in the range [0, 1] and calculated with
`sqrt((x-width/2)/(width/2)^2 + (y-height/2)/(height/2)^2)`
where x and y is the position of the cell, and the width and height parameters are the target dimensions for the entire word cloud.

And now for the blur, which ties everything together. There are two approaches we tried. One used a gaussian distribution with a mean about the target length to define whether or a character would render depending on how much blur we wanted. The logic is quite simple:
`if (1-d) * gaus > blur then render`
where d is the distance from the center in the range [0, 1], and gaus is a random value in the range [0, 1] sampled from a gaussian distribution.
The second method uses a sigmoid function to define the probability of a character spawning relative to a target length, defined as
`p = 1/(1 + e^(f * l))`
where l is length and f is falloff.
Both methods look great, and are currently used in the website. The gaussian blur is applied to the wave function, and the sigmoid is used by the wave.
For exact replication the current values we're using for these functions are `blur = 0.15` and `f=2`, for the cloud and wave respectively.

## The Leaderboard Stack

Since we were building this website in anticipation of the [Hacktoberfest](https://hactoberfest.com) event, we wanted to have a leaderboard to track the contributions of the club members. We decided to use the [GitHub API](https://docs.github.com/en/rest) to fetch the contributions of the club members and display them on the website. Now how do we get the data for _all_ the users? We first tried using a single API key to get all the data but soon got heavily rate limited :upsidedown:. After further consideration we ended up developing a simple GitHub Actions workflow that each member could easily implement. This action fetched their statistics and sent them to our backend server which stores all this in [MongoDB]().

After 3 days of data collection we could dive into how we want to present this data, we first thought of using overall statistics but in the end settled on the following:
+ Contributions over the past 24 hours (commits + PRs)
+ Contributions since the member joined the system (commits + PRs)

We also collect additional data such as followers and similar for further analysis or display.

### In Production Panic :scream:
After about five days in production we noticed something strange. For a lot of the users the metrics (especially commits) were not being displayed properly, which was really strange since we could see all the data coming in from the users. This made us wonder if our feature was really working or what we had seen was just some coincidental success.
This motivated us to dig deeper into the issue, revealing that if a user creates commits on a branch under PR or not, as long as it is not merged into main or the primary branch of the repository, it will not be counted as a contribution to the users profile. This was a major issue since we had a lot of users who were contributing to the club's website and other repositories but their contributions were not being counted.
In the end the only reasonable solution to this bug/(feature?) was to add a disclaimer to the website and make sure all intended commits get merged into the primary branch of the repository.

```json
// Sample of the data we collect
{
  "username": "velocitatem",
  "date": "2023-09-29T10:59:55.624Z",
  "commits": 1580,
  "pull_requests": 187,
  "user": {
    "followers": 15,
    "following": 67,
    "public_repos": 129,
    "public_gists": 21,
    "id": 60182044
  },
  "stars": 64,
  "cc": 75
}
```

## SEO Implementation
### By @haxybaxy
Implementing search engine optimization was made much easier thanks to Astro. I was able to use [this component](https://github.com/jonasmerlin/astro-seo) to let search engines index and follow links on our wesbite, as well as the photos (uploaded on imgur) and text for OpenGraph and Twitter. 

## UI/UX Design Strategy
### By @jose-izarra

When developing the UI/UX design of our page, we wanted the user experience to feel as unique as possible. We touched in our strengths as a robotics club, leaning into a very techie design with interesting, engaging features. Additions such as the github leaderboard, our (literal) burger in the top left, the ever-changing wave background, and our amazing dark mode feature (highly reccomended). Our website is a demonstration of all of our personalities shining through to create this beautiful project. 

## Conclusion
- Sum up the key takeaways from each section.
- A call-to-action, encouraging readers to explore the features discussed.

## References
- [External Link 1](https://example.com)
- [External Link 2](https://example.com)

---

_Author(s): @i-be-keggles, @velocitatem, @jose-izarra, @haxybaxy_
_Date: Month, Day, Year_
