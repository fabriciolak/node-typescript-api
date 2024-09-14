import 'node';
import supertest from 'supertest';

declare global {
  var testRequest: import('supertest').SuperTest<import('supertest').Test>;
}
