const { formatText } = require('./../formatting')

test('formatText formats user mentions properly', () => {
  const inputUserMentionsExpectedOutput = {
    'Go home <@ USA5H7BUN> <@ US7Q3P2J2>': 'Go home <@USA5H7BUN> <@US7Q3P2J2>',
    'Go home < @USA5H7BUN> <@US7Q3P2J2>': 'Go home <@USA5H7BUN> <@US7Q3P2J2>'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputUserMentionsExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats user channel properly', () => {
  const inputChannelMentionsExpectedOutput = {
    'Wear a mask <# CS5MGR57X | reacjilator-test>':
      'Wear a mask <#CS5MGR57X|reacjilator-test>',
    '<#CRSSAFLBU | language-translation-bot-test> Wearing a mask <# CS7GN1BSB | slack-translator-test>':
      '<#CRSSAFLBU|language-translation-bot-test> Wearing a mask <#CS7GN1BSB|slack-translator-test>',
    '<# CS7S1ABGE | lingvanex-test> <#CRSSAFLBU | language-translation-bot-test> Wearing a mask':
      '<#CS7S1ABGE|lingvanex-test> <#CRSSAFLBU|language-translation-bot-test> Wearing a mask'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputChannelMentionsExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats special mentions properly', () => {
  const inputSpecialMentionsExpectedOutput = {
    '<! here> wear a mask': '<!here> wear a mask',
    'Wear a mask <! Here>': 'Wear a mask <!here>',
    '<! channel> wear a mask': '<!channel> wear a mask',
    'Wear a mask <! Channel>': 'Wear a mask <!channel>'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputSpecialMentionsExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats emojis properly', () => {
  const inputEmojisExpectedOutput = {
    ': smile:': ':smile:',
    ': globe_with_meridians:': ':globe_with_meridians:',
    ': male-firefighter:': ':male-firefighter:',
    ': male-police-officer :: skin-tone-4:':
      ':male-police-officer::skin-tone-4:'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputEmojisExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats links properly', () => {
  const inputLinksExpectedOutput = {
    '<http: //canva.com': '<http://canva.com',
    '<https: //canva.com': '<https://canva.com',
    '< https: //www.canva.com': '<https://www.canva.com'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputLinksExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats strikethroughs properly', () => {
  const inputStrikethroughsExpectedOutput = {
    '~ Wear a mask ~': '~Wear a mask~'
  }
  for (const [input, expectedOutput] of Object.entries(
    inputStrikethroughsExpectedOutput
  )) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})

test('formatText formats strikethroughs properly', () => {
  const inputsExpectedOutput = {
    '& gt; nice': '&gt; nice'
  }
  for (const [input, expectedOutput] of Object.entries(inputsExpectedOutput)) {
    expect(formatText(input)).toBe(expectedOutput)
  }
})
