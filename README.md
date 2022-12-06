# Notes

As this was a tech test, I didn't spend as much time on it as I would with a real app. A few areas that would deserve more attention, given more time:

- The UI as a whole is messy and uses a lot of cluttered styling. Used Material UI to save time as I assume we're interested in functionality rather than appearance?
- The app is all done by page. I would pull a lot of this out into separate components.
- There are likely some unneccessary dependencies still included as I was throwing this together. e.g. I wouldn't import the whole of lodash, just the minimal set of functions needed.
- There are a few places where I'm using vanilla JS to accomplish things that I'm aware there are helper libraries for, which diminishes readability.
- There are bugs I'm aware of (e.g. going to a product page and then changing the filters) due to quirks in react-router, which this exercise hinges on. I'm not familiar enough to solve them quickly.
- The checkboxes are changing from controlled to uncontrolled. I'm not sure why as I believe they're controlled, and this was tricky to track down.
- The test suite is nowhere near comprehensive, but hopefully demonstrates what I'd look to do.
- No optimistic UI for loading
- No spinners
- No state management or context, so loaders are inefficient
