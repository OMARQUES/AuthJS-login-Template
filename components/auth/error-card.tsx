import { CardWrapper } from './card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const ErrorCard = () => {
    return (
        <CardWrapper 
        headerLabel='Opa! Algo deu errado'
        backButtonHref='/auth/login'
        backButtonLabel='Fazer Login'
        >
            <div className='w-full items-center flex justify-center'>
                <ExclamationTriangleIcon className='text-destructive'/>
            </div>
        </CardWrapper>
    )
}