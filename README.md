Simple bingo card template!

Config:
 - boardSize int N = NxN spaces
 - freespot bool = include free spot in middle or not (only available if N is odd)
 - items, singles_can = array of subarrays, only one item in each subarray will potentially appear
 - items, singles_must = array of subarrays, one item in each subarray must appear
 - items, any = array of items, any of which will potentially appear

Licensed under GPLv3.0. See [LICENSE](./LICENSE) for details.


Suggested Usage:
 - Change title, metadata, header in [index.html](./index.html)
 - Change [config.json](./config.json) for your needs
 - (Optionally) change free space logos and replace the [marked.png](images/marked.png) and [unmarked.png](images/unmarked.png)
 - (Optionally) change color themes as you please, all used colors are defined at the top of the css style sheet for light and dark mode
