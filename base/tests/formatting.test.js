const { formatText } = require('./../formatting');

test('formatText formats emojis properly', () => {
  const testEmojisAndResponses = {
    ': smile:': ':smile:',
    ': globe_with_meridians:': ':globe_with_meridians:',
    ': male-firefighter:': ':male-firefighter:',
    ': male-police-officer :: skin-tone-4:': ':male-police-officer::skin-tone-4:'
  }
  for (const [input, expectedOutput] of Object.entries(testEmojisAndResponses)) {
    expect(formatText(input)).toBe(expectedOutput);
  }
})

test('formatText formats links properly', () => {
  const testLinksAndResponses = {
    '<http: //canva.com': '<http://canva.com',
    '<https: //canva.com': '<https://canva.com',
    '< https: //www.canva.com': '<https://www.canva.com',
  }
  for (const [input, expectedOutput] of Object.entries(testLinksAndResponses)) {
    expect(formatText(input)).toBe(expectedOutput);
  }
})

