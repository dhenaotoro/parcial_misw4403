import { IsString, IsNotEmpty, IsUrl } from "class-validator"

export class SupermercadoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    longitud: string
    
    @IsString()
    @IsNotEmpty()
    latitud: string

    @IsUrl()
    @IsNotEmpty()
    paginaWeb: string
}
