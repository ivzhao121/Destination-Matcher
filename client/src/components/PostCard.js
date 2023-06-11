import Card from '@mui/material/Card';
import { blueGrey } from '@mui/material/colors';

export default function IntroductionPane() {
    return (
        <div>
            <Card style={{width: '800px', height: '1000px', background: 'pink'}}> 
                <h1>
                    <h1 style={{textAlign: 'center', marginTop: '200px', marginLeft: '80px', color: 'white', fontSize: 70, fontWeight: 'bold', fontFamily: 'Raleway'}}>Find</h1>
                    <h1 style={{textAlign: 'center', marginTop: '50px', marginLeft: '80px', color: 'white', fontSize: 70, fontWeight: 'bold', fontFamily: 'Raleway'}}>Your</h1> 
                    <h1 style={{textAlign: 'center', marginTop: '50px', marginLeft: '80px', color: 'white', fontSize: 70, fontWeight: 'bold', fontFamily: 'Raleway'}}>Next</h1>
                    <h1 style={{textAlign: 'center', marginTop: '50px', marginLeft: '80px', color: 'white', fontSize: 70, fontWeight: 'bold', fontFamily: 'Raleway'}}>Destination!</h1>
                    </h1>
            </Card>
        </div>
        
    )
}