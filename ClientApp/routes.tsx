import * as React from "react";
import { Route } from "react-router-dom";
import Row from "antd/lib/Row";
import Col from "antd/lib/Col";
import PessoasList from "./components/PessoasList";
import PessoasForm from "./components/PessoasForm";

export const routes = (
    <Row>
        <Col offset={3} span={18}>
            <Route exact={true} path="/" component={PessoasList} />
            <Route exact path="/create" component={PessoasForm} />
            <Route path="/edit/:id" component={PessoasForm} />
        </Col>
    </Row>
);
