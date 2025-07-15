Simple bingo card template!

Config:
  boardSize int N = NxN spaces
  freespot bool = include free spot in middle or not (only available if N is odd)
  items, singles_can = array of subarrays, only one item in each subarray will potentially appear
  items, singles_must = array of subarrays, one item in each subarray must appear
  items, any = array of items, any of which will potentially appear

Otherwise WIP, but currently functional. Need more design work for toggle, and especially for light mode.

Licensed under GPLv3.0. See [LICENSE](./LICENSE) for details.
