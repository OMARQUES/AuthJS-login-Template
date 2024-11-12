import { CardWrapper } from './card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { PATH } from '../../utils/constants';

export const ErrorCard = () => {
    return (
        <CardWrapper 
        headerLabel='Opa! Algo deu errado'
        backButtonHref= {PATH.LOGIN_PATH}
        backButtonLabel='Fazer Login'
        >
            <div className='w-full items-center flex justify-center'>
                <ExclamationTriangleIcon className='text-destructive'/>
            </div>
        </CardWrapper>
    )
}