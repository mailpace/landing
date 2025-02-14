---
title: Caching HTTP Requests Between Services Using Redis, Axios, and Node.js
publishDate: 2023-04-13T10:15:03.284Z
excerpt: An example of how we can use Redis to cache data when communicating between micro services and http services more generally
category: Guides
---

Caching is a technique used to store and reuse the results of expensive operations or frequently accessed data to improve an application's performance and responsiveness. In this blog post, we will explore how to cache HTTP requests between services using Redis, Axios, and Node.js. This will help to reduce the load on your services, minimize latency, and improve the overall user experience.

We use this pattern at [MailPace](https://mailpace.com) when passing data between some of our services. So for example, when we need to sign an email with DKIM, we request the signing key over HTTPS from our API service. We then cache the result of that in Redis so that we don't need to make a fresh request to the API on every subsequent send for that domain.

Below we'll create a server, that requests data from an imaginary endpoint, and cache that data on the first request. Subsequent requests will use the cached data, until the cached data expires (after 60 seconds in this case).

## Prerequisites

Before diving into the implementation, make sure you have the following installed on your system:

- Node.js and npm
- Redis

Let's get started!

## Step 1: Setting up a Node.js Project

First, create a new directory for your project and navigate into it:

```
mkdir redis-cache-example
cd redis-cache-example
```

Next, initialize a new Node.js project with the following command:

`npm init -y`

## Step 2: Installing Dependencies

For this project, we will be using the following dependencies:

- axios: A popular HTTP client for making requests
- express: A minimal web framework for Node.js
- redis: A Node.js client for Redis

Install these dependencies using npm:

`npm install axios express redis`

## Step 3: Creating a Basic Express Server

Create an index.js file in your project directory and add the following code to set up a basic Express server:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Step 4: Implementing Redis and Axios

Now, let's implement Redis and Axios to cache HTTP requests between services. First, import the required modules and create a Redis client:

```javascript
const axios = require('axios');
const redis = require('redis');
const client = redis.createClient();
```

Next, create a new route for fetching data from an external API. In this example, we will use the JSONPlaceholder API to fetch a list of posts:

```javascript
app.get('/posts', async (req, res) => {
  // ...
});
```

Inside the /posts route, check if the data is already cached in Redis. If it's cached, return the cached data. Otherwise, fetch the data from the API using Axios, store it in Redis, and return it:

```javascript
app.get('/posts', async (req, res) => {
  client.get('posts', async (err, cachedData) => {
    if (err) throw err;

    if (cachedData) {
      res.send(JSON.parse(cachedData));
    } else {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
      client.set('posts', JSON.stringify(data), 'EX', 60);
      res.send(data);
    }
  });
});
```

In this example, we set the cache to expire after 60 seconds using the Redis EX' flag, which will remove any entries that are older than 60 seconds.

The way it does this is kind of interesting, details are here: https://redis.io/commands/expire/#how-redis-expires-keys but in short: There are two ways - the passive way, where a key is simply expired when a client tries to access it, and **the active way, where Redis randomly tests a few keys among those set to expire and deletes them. This process keeps going until the percentage of expired keys is under 25%**, ensuring that the memory isn't clogged up with a ton of expired keys, and Redis can keep operating at lightning speed!

## Step 5: Testing the Cache

Run your server using the following command:

`node index.js`

Now, use your preferred API testing tool (e.g., Postman or curl) to make requests to the /posts endpoint. **The first request will fetch the data from the API and store it in Redis. Subsequent requests within the 60-second cache duration will return the cached data**, reducing the load on the external API.

## Follow ups

We didn't speak about expiring the cache, beyond the 60s timeout. If you want to cache data for longer, but need to forcefully be able to expire it when something else changes (e.g. in our case if a domain's DKIM key is changed), you'll need an endpoint you can call that removes the key from Redis.

This problem is actually really tough to solve at scale, as you can have n number of caches. But you'll go a long, long way with the above and a short expiry.
