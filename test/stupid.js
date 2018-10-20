
// This is a sample file of Jest tests

import {truetype} from '../src/lib/stupid';

test('correctly identifies the type of Numbers', () => {
  expect(truetype(2)).toBe('number');
});

test('correctly identifies the type of null', () => {
  expect(truetype(null)).toBe('null');
});
