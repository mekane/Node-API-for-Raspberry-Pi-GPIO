const expect = require('chai').expect;

const {FilePersistence, Scheduler} = require('../src/Scheduler.js');

function PersistenceSpy() {
    return {
        data: [],
        getCalled: 0,
        putCalled: 0,
        getJson: function () {
            this.getCalled++;
            return this.data;
        },
        putJson: function (newData) {
            this.data = newData;
            this.putCalled++;
        }
    }
}

describe('The Scheduler module', () => {
    it('exports an initializer function', () => {
        expect(Scheduler).to.be.a('function');
    })

    it('exports a default persistence module initializer', () => {
        expect(FilePersistence).to.be.a('function')
    })
})

describe('the FilePersistence', () => {
    it('is initialized with a file location', () => {
        const filePersistence = FilePersistence('/test/path/to/file.json')
        expect(filePersistence).to.be.an('object')
    })

    it('provides `getJson` and `putJson` methods', () => {
        const filePersistence = FilePersistence('/test/path/to/file.json')
        expect(filePersistence.getJson).to.be.a('function')
        expect(filePersistence.putJson).to.be.a('function')
    })
})

describe('the Scheduler', () => {
    it('is initialized with a persistence module', () => {
        const validPersistence = {
            getJson: _ => _,
            putJson: _ => _
        }
        expect(Scheduler(validPersistence)).to.be.an('object')
    })

    it('throws an exception if initialized with invalid persistence', () => {
        const invalidPersistence = () => Scheduler();
        const invalidPersistenceNoGet = () => Scheduler({put: _ => _});
        const invalidPersistenceNoPut = () => Scheduler({get: _ => _});

        expect(invalidPersistence).to.throw();
        expect(invalidPersistenceNoGet).to.throw();
        expect(invalidPersistenceNoPut).to.throw();
    })

    it('has a scheduleTask method that does nothing for bad arguments', () => {
        const persistenceSpy = PersistenceSpy();
        const scheduler = Scheduler(persistenceSpy);

        scheduler.scheduleTask();
        scheduler.scheduleTask(0);
        scheduler.scheduleTask(-1, {});

        expect(persistenceSpy.putCalled).to.equal(0);
    })

    it('adds a task to the scheduled jobs log using the persistence module', () => {
        const persistenceSpy = PersistenceSpy();
        const scheduler = Scheduler(persistenceSpy);

        scheduler.scheduleTask(10, {});

        expect(persistenceSpy.putCalled).to.equal(1);
        expect(persistenceSpy.data).to.be.an('array').with.length(1);
        expect(persistenceSpy.data[0]).to.be.an('object');
        expect(persistenceSpy.data[0].time).to.be.a('number');
        expect(persistenceSpy.data[0].action).to.be.an('object');
    })

    it('appends additional tasks to the scheduled job list', () => {
        const persistenceSpy = PersistenceSpy();
        const scheduler = Scheduler(persistenceSpy);

        scheduler.scheduleTask(10, {a: 1});
        scheduler.scheduleTask(11, {a: 2});

        expect(persistenceSpy.putCalled).to.equal(2);
        expect(persistenceSpy.data).deep.equal([
            {time: 10, action: {a: 1}},
            {time: 11, action: {a: 2}}
        ]);
    })

    it('can return a list of jobs whose timestamps are in the past', () => {
        const persistenceSpy = PersistenceSpy();
        const scheduler = Scheduler(persistenceSpy);

        scheduler.scheduleTask(10, {a: 1});
        scheduler.scheduleTask(11, {a: 2});
        scheduler.scheduleTask(12, {a: 3});

        expect(scheduler.getTasksToRun(11)).to.deep.equal([
            {time: 10, action: {a: 1}},
            {time: 11, action: {a: 2}}
        ])
    })
})

describe('Scheduler integration test', () => {
    const fs = require('fs');

    beforeEach(() => {
        try {
            fs.unlinkSync('./test.json');
        } catch (e) {
        }
    })

    afterEach(() => {
        try {
            fs.unlinkSync('./test.json');
        } catch (e) {
        }
    })

    it('Can round-trip a few realistic tasks using the FileStorage', () => {
        const scheduler = Scheduler(FilePersistence('./test.json'))
        scheduler.scheduleTask(10002000, {a: 1});
        scheduler.scheduleTask(10003000, {a: 2});
        scheduler.scheduleTask(10004000, {a: 3});

        expect(scheduler.getTasksToRun(10002500)).to.deep.equal([
            {time: 10002000, action: {a: 1}},
        ])
    })
})