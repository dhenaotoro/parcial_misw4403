import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CiudadDto {
    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    pais: string
    
    @IsNumber()
    @IsNotEmpty()
    numeroHabitantes: number
}

//"raw": "{\n    \"nombre\": \"Asuncion\",\n    \"pais\": \"Paraguay\"\n,\n    \"numeroHabitantes\": 10000000\n}",
//"{\n    \"id\": \"f88c6c85-d970-427e-8a61-38a1af5e3d81\",\n    \"nombre\": \"Bogotá\",\n    \"pais\": \"Paraguay\",\n    \"numeroHabitantes\": 10000000\n}\n"
//"{\n    \"statusCode\": 404,\n    \"message\": \"No fue encontrada la ciudad con el id provisto.\"\n}"

//"raw": "{\n    \"nombre\": \"Los X\",\n    \"longitud\": \"70.01\"\n,\n    \"latitud\": \"20.56\"\n,\n    \"paginaWeb\": \"https://losx.com/\"\n}\n",
//"body": "{\n    \"id\": \"f88c6c85-d970-427e-8a61-38a1af5e3d81\",\n    \"nombre\": \"Los X\",\n    \"longitud\": \"70.01\"\n,\n   \"latitud\": \"20.56\"\n,\n    \"paginaWeb\": \"https://losx.com/\"\n}\n",
