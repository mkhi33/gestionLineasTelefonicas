import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import Alerta from '@/components/Alerta'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ alerta, setAlerta ] = useState({})
    const router = useRouter()

    const { auth, setAuth } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if( [email, password].includes('')){
            setAlerta({
                msj: 'Todos los campos son obligatorios',
                error: true
            })

            return
        }
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correoElectronico: email,
                    contrasenia: password
                }),
            });
            const data = await response.json();
            if(response.ok){
                localStorage.setItem('token', data.token)
                setAuth(data)
                router.push('/')
            }else {
                setAlerta({
                    msj: error.response.data.error,
                    error: true
                })
            }

        } catch (error) {
            console.log(error.response)
            setAlerta({
                msj: 'Ocurrio un error al iniciar sesión',
                error: true
            })
        }
    }
    const { msj } = alerta;

  return (
    <div className='flex flex-col items-center'>
        <h1 className="text-black font-black text-6xl capitalize mt-5">
            Inicia sesión en tu cuenta
        </h1>

        {msj && <Alerta alerta={alerta} />}
        <form onSubmit={handleSubmit} className="my-5 bg-white shadow rounded-lg p-10 w-1/2">
            <div className="my-5 ">
                <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
                <input 
                    id="email"
                    type="email"
                    placeholder="Email De Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                />
            </div>
            <div className="my-5 ">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
                <input 
                    id="password"
                    type="password"
                    placeholder="Password De Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={password}
                    onChange={ e => setPassword(e.target.value)}
                />
            </div>
            <input 
                type="submit"
                value="Iniciar Sesión"
                className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
            />
        </form>
    </div>
  )
}
export default Login