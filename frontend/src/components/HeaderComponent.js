import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <div>
                <header>
                    <nav 
                    className="navbar navbar-dark bg-primary">
                        <div>
                            <a href="/tasks"
                                className="navbar-brand">
                                    Mini Project Gol 3-4
                            </a></div>
                    </nav>
                </header>
            </div>
        )
    }
}

export default HeaderComponent
