

// This is a sample file that does something useless, as an example of what we can test with Jest


function truetype(val) {
  if (val === null) return "null";
  if (typeof val === 'function') return 'object';
  return typeof val;
}


export {truetype};
