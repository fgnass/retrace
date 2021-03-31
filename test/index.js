describe('retrace', () => {
  ['bundle', 'bundle.min', 'bundle.inline'].forEach( name => it('should work in ' + name, async () => testScript(name)) );
});

function testScript(name) {
  return async function() {
    await browser.url('http://localhost:8001/' + name + '.html');
    var title = await browser.$('title');
    await title.waitForExist({ timeout: 2000 });
    await browser.waitUntil(async function() {
      return await title.getText() == name + '.js';
    }, {
      timeout: 2000,
      timeoutMsg: 'expected window title to be set in 2s'
    });
    var el = await browser.$('.stack');
    await el.waitForExist({ timeout: 2000 });
    var text = el.getText();
    expect(text).toEqual('error.js:2:0', 'stack cointains location 1');
    expect(text).toEqual('error.js:6:0', 'stack cointains location 2');
    expect(text).toEqual('main:8:0', 'stack cointains location 3');
  };
}
