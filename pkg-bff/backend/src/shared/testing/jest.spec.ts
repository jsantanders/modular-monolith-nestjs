import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import 'jest';
import { ObjectId } from 'mongodb';

//
// Testing Jest capabilities
//

describe('GIVEN an Object with ObjectId types fields', () => {
  it(`should match an equivalent object with string fields after stringifying and parsing`, async () => {
    const o = {
      _id: new ObjectId('5c36b1295ec9e3fbdc3d1062'),
      name: 'Foo',
      orgId: new ObjectId('5c36b1295ec9e3fbdc3d1054'),
    };

    const objectToMatch = {
      _id: '5c36b1295ec9e3fbdc3d1062',
      name: 'Foo',
      orgId: '5c36b1295ec9e3fbdc3d1054',
    };

    // convert ObjectIds to Strings
    const os = TestingUtils.objectIdsToStrings(o);

    expect(o).not.toMatchObject(objectToMatch);
    expect(os).toMatchObject(objectToMatch);
  });
});
