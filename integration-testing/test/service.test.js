const sinon = require('sinon');
const { expect } = require('chai');
const Service = require('../src/service');
const PrimaryRepository = require('../src/repository');
const SecondaryRepository = require('../src/secondaryRepository');

describe('Service Integration Tests with Multiple Stubs', () => {
    let service;
    let primaryRepositoryStub;
    let secondaryRepositoryStub;

    beforeEach(() => {
        primaryRepositoryStub = sinon.createStubInstance(PrimaryRepository);
        secondaryRepositoryStub = sinon.createStubInstance(SecondaryRepository);
        service = new Service();
        service.primaryRepository = primaryRepositoryStub;
        service.secondaryRepository = secondaryRepositoryStub;
    });

    it('should return item from primary repository if found', () => {
        const item = { id: 1, name: 'Item 1' };
        primaryRepositoryStub.getItemById.withArgs(1).returns(item);

        const result = service.getItemById(1);

        expect(result).to.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.notCalled).to.be.true;
    });

    it('should return item from secondary repository if not found in primary', () => {
        primaryRepositoryStub.getItemById.withArgs(3).returns(null);
        const item = { id: 3, name: 'Item 3' };
        secondaryRepositoryStub.getItemById.withArgs(3).returns(item);

        const result = service.getItemById(3);

        expect(result).to.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
    });

    it('should throw an error if item is not found in both repositories', () => {
        primaryRepositoryStub.getItemById.returns(null);
        secondaryRepositoryStub.getItemById.returns(null);
    
        expect(() => service.getItemById(5)).to.throw('Item not found in both repositories');
        expect(primaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
    });

    it('should delete an item from the primary repository if found', () => {
        const id = 1;
        const deletedItem = { id, name: 'Item 1' };
        primaryRepositoryStub.deleteItem.withArgs(id).returns(deletedItem);
    
        const result = service.deleteItem(id);
    
        expect(result).to.equal(deletedItem);
        expect(primaryRepositoryStub.deleteItem.calledOnceWith(id)).to.be.true;
        expect(secondaryRepositoryStub.deleteItem.notCalled).to.be.true;
    });
    
    it('should delete an item from the secondary repository if not found in primary', () => {
        const id = 3;
        const deletedItem = { id, name: 'Item 3' };
        primaryRepositoryStub.deleteItem.withArgs(id).returns(null);
        secondaryRepositoryStub.deleteItem.withArgs(id).returns(deletedItem);
    
        const result = service.deleteItem(id);
    
        expect(result).to.equal(deletedItem);
        expect(primaryRepositoryStub.deleteItem.calledOnceWith(id)).to.be.true;
        expect(secondaryRepositoryStub.deleteItem.calledOnceWith(id)).to.be.true;
    });
    
    it('should throw an error when trying to delete a non-existent item', () => {
        const id = 5;
        primaryRepositoryStub.deleteItem.withArgs(id).returns(null);
        secondaryRepositoryStub.deleteItem.withArgs(id).returns(null);
    
        expect(() => service.deleteItem(id)).to.throw('Item not found in both repositories');
        expect(primaryRepositoryStub.deleteItem.calledOnceWith(id)).to.be.true;
        expect(secondaryRepositoryStub.deleteItem.calledOnceWith(id)).to.be.true;
    });
    
});
