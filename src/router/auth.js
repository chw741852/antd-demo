import React, { PropTypes } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';

const AuthExample = () => (
    <Router>
        <div>
            <AuthButton/>
            <ul>
                <li><Link to="/public">公开页面</Link></li>
                <li><Link to="/protected">保护页面</Link></li>
            </ul>

            <hr/>

            <Route path="/public" component={Public}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/protected" component={Protected}/>
        </div>
    </Router>
);

const fakeAuth = {
    isAuthenticated: false,
    authenticated(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100);    // 模拟异步
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);    // 模拟异步
    }
};

const AuthButton = withRouter(({ history }) => (
    fakeAuth.isAuthenticated ? (
        <p>
            欢迎! <button onClick={() => {
            fakeAuth.signout(() => history.push('/'))
        }}>登出</button>
        </p>
        ) : (
            <p>请先登录</p>
        )
));

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        fakeAuth.isAuthenticated ? (
                <Component {...props}/>
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
            )
    )}/>
);

const Public = () => <div>公开的页面</div>;
const Protected = () => <div>保护的页面</div>;

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    };

    login = () => {
        fakeAuth.authenticated(() => {
            this.setState({ redirectToReferrer: true })
        })
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div>
                <p>若想访问 {from.pathname} ，你需要先登录</p>
                <button onClick={this.login}>登录</button>
            </div>
        );
    }
}

export default AuthExample;
