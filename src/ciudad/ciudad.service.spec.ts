import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: faker.location.country(),
        numeroHabitantes: faker.number.int({min: 500000, max: 1000000})
      });
      ciudadesList.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne debe retornar una ciudad por id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.numeroHabitantes).toEqual(storedCiudad.numeroHabitantes);
  });

  it('findOne debe lanzar una excepcion para una ciudad invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('create debe crear una nueva ciudad cuando es del pais Argentina', async () => {
    const ciudad: CiudadEntity = {
      id: faker.string.uuid(),
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000}),
      supermercados: [ Object.assign(new SupermercadoEntity(), {}) ]
    };
    const nuevaCiudad: CiudadEntity = await service.create(ciudad);

    const almacenadaCiudad: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}});
    expect(almacenadaCiudad).not.toBeNull();
    expect(almacenadaCiudad.nombre).toEqual(nuevaCiudad.nombre);
    expect(almacenadaCiudad.pais).toEqual(nuevaCiudad.pais);
    expect(almacenadaCiudad.numeroHabitantes).toEqual(nuevaCiudad.numeroHabitantes);
  });

  it('create debe crear una nueva ciudad cuando es del pais Ecuador', async () => {
    const ciudad: CiudadEntity = {
      id: faker.string.uuid(),
      nombre: faker.location.city(),
      pais: 'Ecuador',
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000}),
      supermercados: [ Object.assign(new SupermercadoEntity(), {}) ]
    };
    const nuevaCiudad: CiudadEntity = await service.create(ciudad);

    const almacenadaCiudad: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}});
    expect(almacenadaCiudad).not.toBeNull();
    expect(almacenadaCiudad.nombre).toEqual(nuevaCiudad.nombre);
    expect(almacenadaCiudad.pais).toEqual(nuevaCiudad.pais);
    expect(almacenadaCiudad.numeroHabitantes).toEqual(nuevaCiudad.numeroHabitantes);
  });

  it('create debe crear una nueva ciudad cuando es del pais Paraguay', async () => {
    const ciudad: CiudadEntity = {
      id: faker.string.uuid(),
      nombre: faker.location.city(),
      pais: 'Paraguay',
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000}),
      supermercados: [ Object.assign(new SupermercadoEntity(), {}) ]
    };
    const nuevaCiudad: CiudadEntity = await service.create(ciudad);

    const almacenadaCiudad: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}});
    expect(almacenadaCiudad).not.toBeNull();
    expect(almacenadaCiudad.nombre).toEqual(nuevaCiudad.nombre);
    expect(almacenadaCiudad.pais).toEqual(nuevaCiudad.pais);
    expect(almacenadaCiudad.numeroHabitantes).toEqual(nuevaCiudad.numeroHabitantes);
  });

  it('create debe lanzar una excepcion al crear una ciudad de un pais invalido', async () => {
    const ciudad: CiudadEntity = {
      id: faker.string.uuid(),
      nombre: faker.location.city(),
      pais: 'Colombia',
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000}),
      supermercados: [ Object.assign(new SupermercadoEntity(), {}) ]
    };

    await expect(() => service.create(ciudad)).rejects.toHaveProperty('message', `País Colombia no permitido para asociar la ciudad ${ciudad.nombre}.`);
  });

  it('update debe modificar una ciudad cuando es del pais Argentina', async () => {
    const ciudadAActualizar = ciudadesList[0];
    ciudadAActualizar.nombre = 'Nuevo nombre';
    ciudadAActualizar.pais = 'Argentina';
    ciudadAActualizar.numeroHabitantes = 700000;

    const actualizadaCiudad = await service.update(ciudadAActualizar.id, ciudadAActualizar);
    expect(actualizadaCiudad).not.toBeNull();

    expect(actualizadaCiudad.nombre).toEqual(ciudadAActualizar.nombre);
    expect(actualizadaCiudad.numeroHabitantes).toEqual(ciudadAActualizar.numeroHabitantes);
  });

  it('update debe modificar una ciudad cuando es del pais Ecuador', async () => {
    const ciudadAActualizar = ciudadesList[0];
    ciudadAActualizar.nombre = 'Nuevo nombre';
    ciudadAActualizar.pais = 'Ecuador';
    ciudadAActualizar.numeroHabitantes = 700000;

    const actualizadaCiudad = await service.update(ciudadAActualizar.id, ciudadAActualizar);
    expect(actualizadaCiudad).not.toBeNull();

    expect(actualizadaCiudad.nombre).toEqual(ciudadAActualizar.nombre);
    expect(actualizadaCiudad.numeroHabitantes).toEqual(ciudadAActualizar.numeroHabitantes);
  });

  it('update debe modificar una ciudad cuando es del pais Paraguay', async () => {
    const ciudadAActualizar = ciudadesList[0];
    ciudadAActualizar.nombre = 'Nuevo nombre';
    ciudadAActualizar.pais = 'Paraguay';
    ciudadAActualizar.numeroHabitantes = 700000;

    const actualizadaCiudad = await service.update(ciudadAActualizar.id, ciudadAActualizar);
    expect(actualizadaCiudad).not.toBeNull();

    expect(actualizadaCiudad.nombre).toEqual(ciudadAActualizar.nombre);
    expect(actualizadaCiudad.numeroHabitantes).toEqual(ciudadAActualizar.numeroHabitantes);
  });

  it('update debe lanzar una excepcion al actualizar una ciudad de un pais invalido', async () => {
    const ciudadAActualizar = ciudadesList[0];
    ciudadAActualizar.nombre = 'Nuevo nombre';
    ciudadAActualizar.pais = 'Colombia';
    ciudadAActualizar.numeroHabitantes = 700000;

    await expect(() => service.update(ciudadAActualizar.id, ciudadAActualizar)).rejects.toHaveProperty("message", `País Colombia no permitido para asociar la ciudad ${ciudadAActualizar.nombre}.`);
  });

  it('update debe lanzar una excepcion para una ciudad invalida', async () => {
    const ciudadAActualizar = ciudadesList[1];
    ciudadAActualizar.nombre = "Nuevo nombre";
    ciudadAActualizar.numeroHabitantes = 700000;

    await expect(() => service.update("0", ciudadAActualizar)).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('delete debe eliminar una ciudad', async () => {
    const ciudadAEliminar = ciudadesList[0];

    await service.delete(ciudadAEliminar.id);

    const ciudadEliminada = await repository.findOne({ where: {id: ciudadAEliminar.id}});
    expect(ciudadEliminada).toBeNull();
  });

  it('delete debe lanzar una excepcion para una ciudad invalida', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });
});
