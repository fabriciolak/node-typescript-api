import 'node';

declare global {
  var testRequest: import('supertest').SuperTest<import('supertest').Test>;
}
