import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../Services/user.service";

export default function UserDetailsRegister({rut}) {
    const [User, setUser] = useState({});
    const Navigate = useNavigate();


    useEffect(() => {
        userService
            .getRut(rut)
            .then(response => {
                setUser(response.data);
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar mostrar el detalle del cliente", error);
            });
    }, [rut]);

    const handleAccept = () => {
        if(window.confirm("¿Está seguro de aceptar el registro del usuario?")){
            const updatedUser = {
                'id': User.id,
                'name': User.name,
                'lastname': User.lastname,
                'rut': User.rut,
                'birthdate': User.birthdate,
                'register': true
            }

            userService
                .update(updatedUser)
                .then(response => {
                    console.log("Usuario aceptado correctamente", response);
                    Navigate("/admin/home/clients");
                })
                .catch((error) => {
                    console.log("Se ha producido un error al intentar aceptar el registro del usuario", error);
                });

        }
    };

    const handleReject = () => {
        if(window.confirm("¿Está seguro de rechazar el registro del usuario?")){
            userService
                .remove(User.id)
                .then(response => {
                    console.log("Usuario rechazado correctamente", response);
                    Navigate("/admin/home/clients");
                })
                .catch((error) => {
                    console.log("Se ha producido un error al intentar rechazar el registro del usuario", error);
                });
        }
    };

    return (
        <div className='w-full h-full flex justify-center items-center'>
            {User ? (
                <div className="h-full w-full p-4 text-black">
                    <h1 className='w-full h-1/4 items-center justify-center flex font-bold text-custom-blue'>Información solicitud de registro del usuario</h1>
                    <div className='w-full h-1/4 flex justify-between items-center p-4'>
                        <div className="w-1/2 h-full flex justify-center items-center p-4 m-2 bg-white border rounded-md border-blue-400 drop-shadow-md">
                            <h2 className="font-bold p-4 text-custom-blue-light">Nombre del usuario:</h2>
                            <p className="font-medium p-4">{User.name}</p>
                        </div>
                        <div className="w-1/2 h-full flex justify-center items-center p-4 m-2 bg-white border rounded-md border-blue-400 drop-shadow-md">
                            <h2 className="font-bold p-4 text-custom-blue-light">Apellido del usuario</h2>
                            <p className="font-medium p-4">{User.lastname}</p>
                        </div>
                    </div>
                    <div className='w-full h-1/4 flex justify-between items-center p-4'>
                        <div className="w-1/2 h-full flex justify-center items-center p-4 m-2 bg-white border rounded-md border-blue-400 drop-shadow-md">
                            <h2 className="font-bold p-4 text-custom-blue-light">
                                Rut del usuario
                            </h2>
                            <p className="font-medium p-4">{User.rut}</p>
                        </div>
                        <div className='w-1/2 h-full flex justify-center items-center p-4 m-2 bg-white border rounded-md border-blue-400 drop-shadow-md'>
                            <h2 className="font-bold p-4 text-custom-blue-light">
                                Fecha de nacimiento
                            </h2>
                            <p className="font-medium p-4">{new Date(User.birthdate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="w-full h-1/4 justify-between items-center">
                        <button className="bg-green-500 text-white rounded p-4 m-4 w-1/3 h-1/2" onClick={handleAccept}> aceptar registro </button>
                        <button className="bg-red-500 text-white rounded p-4 m-4 w-1/3 h-1/2" onClick={handleReject}> rechazar registro </button>
                    </div>
            </div>
            ) : (
                <p className="text-gray-500 w-full h-full flex justify-center items-center">Cargando información del usuario...</p>
            )}
        </div>
    );

};