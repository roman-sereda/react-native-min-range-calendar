import { compareAsc, format } from 'date-fns';
import React, { Component } from 'react';
import Month from './components/Month';

class DDD extends Component{
    render(){
        return(
            <div>
              <Month />
            </div>
        )
    }
}

export default DDD;
