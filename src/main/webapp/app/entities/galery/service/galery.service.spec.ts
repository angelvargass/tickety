import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGalery } from '../galery.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../galery.test-samples';

import { GaleryService } from './galery.service';

const requireRestSample: IGalery = {
  ...sampleWithRequiredData,
};

describe('Galery Service', () => {
  let service: GaleryService;
  let httpMock: HttpTestingController;
  let expectedResult: IGalery | IGalery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GaleryService);
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

    it('should create a Galery', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const galery = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(galery).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Galery', () => {
      const galery = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(galery).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Galery', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Galery', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Galery', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGaleryToCollectionIfMissing', () => {
      it('should add a Galery to an empty array', () => {
        const galery: IGalery = sampleWithRequiredData;
        expectedResult = service.addGaleryToCollectionIfMissing([], galery);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(galery);
      });

      it('should not add a Galery to an array that contains it', () => {
        const galery: IGalery = sampleWithRequiredData;
        const galeryCollection: IGalery[] = [
          {
            ...galery,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGaleryToCollectionIfMissing(galeryCollection, galery);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Galery to an array that doesn't contain it", () => {
        const galery: IGalery = sampleWithRequiredData;
        const galeryCollection: IGalery[] = [sampleWithPartialData];
        expectedResult = service.addGaleryToCollectionIfMissing(galeryCollection, galery);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(galery);
      });

      it('should add only unique Galery to an array', () => {
        const galeryArray: IGalery[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const galeryCollection: IGalery[] = [sampleWithRequiredData];
        expectedResult = service.addGaleryToCollectionIfMissing(galeryCollection, ...galeryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const galery: IGalery = sampleWithRequiredData;
        const galery2: IGalery = sampleWithPartialData;
        expectedResult = service.addGaleryToCollectionIfMissing([], galery, galery2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(galery);
        expect(expectedResult).toContain(galery2);
      });

      it('should accept null and undefined values', () => {
        const galery: IGalery = sampleWithRequiredData;
        expectedResult = service.addGaleryToCollectionIfMissing([], null, galery, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(galery);
      });

      it('should return initial array if no Galery is added', () => {
        const galeryCollection: IGalery[] = [sampleWithRequiredData];
        expectedResult = service.addGaleryToCollectionIfMissing(galeryCollection, undefined, null);
        expect(expectedResult).toEqual(galeryCollection);
      });
    });

    describe('compareGalery', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGalery(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGalery(entity1, entity2);
        const compareResult2 = service.compareGalery(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGalery(entity1, entity2);
        const compareResult2 = service.compareGalery(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGalery(entity1, entity2);
        const compareResult2 = service.compareGalery(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
