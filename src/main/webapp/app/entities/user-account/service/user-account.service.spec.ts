import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserAccount } from '../user-account.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-account.test-samples';

import { UserAccountService } from './user-account.service';

const requireRestSample: IUserAccount = {
  ...sampleWithRequiredData,
};

describe('UserAccount Service', () => {
  let service: UserAccountService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserAccount | IUserAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserAccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserAccount', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userAccount = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserAccount', () => {
      const userAccount = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserAccount', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserAccount', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserAccount', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserAccountToCollectionIfMissing', () => {
      it('should add a UserAccount to an empty array', () => {
        const userAccount: IUserAccount = sampleWithRequiredData;
        expectedResult = service.addUserAccountToCollectionIfMissing([], userAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userAccount);
      });

      it('should not add a UserAccount to an array that contains it', () => {
        const userAccount: IUserAccount = sampleWithRequiredData;
        const userAccountCollection: IUserAccount[] = [
          {
            ...userAccount,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserAccountToCollectionIfMissing(userAccountCollection, userAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserAccount to an array that doesn't contain it", () => {
        const userAccount: IUserAccount = sampleWithRequiredData;
        const userAccountCollection: IUserAccount[] = [sampleWithPartialData];
        expectedResult = service.addUserAccountToCollectionIfMissing(userAccountCollection, userAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userAccount);
      });

      it('should add only unique UserAccount to an array', () => {
        const userAccountArray: IUserAccount[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userAccountCollection: IUserAccount[] = [sampleWithRequiredData];
        expectedResult = service.addUserAccountToCollectionIfMissing(userAccountCollection, ...userAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userAccount: IUserAccount = sampleWithRequiredData;
        const userAccount2: IUserAccount = sampleWithPartialData;
        expectedResult = service.addUserAccountToCollectionIfMissing([], userAccount, userAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userAccount);
        expect(expectedResult).toContain(userAccount2);
      });

      it('should accept null and undefined values', () => {
        const userAccount: IUserAccount = sampleWithRequiredData;
        expectedResult = service.addUserAccountToCollectionIfMissing([], null, userAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userAccount);
      });

      it('should return initial array if no UserAccount is added', () => {
        const userAccountCollection: IUserAccount[] = [sampleWithRequiredData];
        expectedResult = service.addUserAccountToCollectionIfMissing(userAccountCollection, undefined, null);
        expect(expectedResult).toEqual(userAccountCollection);
      });
    });

    describe('compareUserAccount', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserAccount(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserAccount(entity1, entity2);
        const compareResult2 = service.compareUserAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserAccount(entity1, entity2);
        const compareResult2 = service.compareUserAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserAccount(entity1, entity2);
        const compareResult2 = service.compareUserAccount(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
