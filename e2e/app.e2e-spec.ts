import { VotingAppClientPage } from './app.po';

describe('voting-app-client App', () => {
  let page: VotingAppClientPage;

  beforeEach(() => {
    page = new VotingAppClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
