import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import Form, { FormComponentProps } from "antd/lib/Form";
import Row from "antd/lib/Row";
import Col from "antd/lib/Col";
import Icon from "antd/lib/Icon";
import Input from "antd/lib/Input";
import Button from "antd/lib/Button";
import Select from "antd/lib/Select";
import * as Models from "../store/Models";

interface EnderecoProps {
    formRef: (e: any) => void;
    endereco: Models.Endereco;
}

class EnderecoForm extends React.Component<EnderecoProps & FormComponentProps> {
    constructor(props: any) {
        super(props);

        props.formRef(this);
    }

    preventEvent = (e: any) => {
        e.preventDefault();
        return false;
    };

    submitForm() {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject();
                } else {
                    resolve(values);
                }
            });
        });
    }

    render() {
        const { endereco, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.preventEvent}>
                <Form.Item>
                    {getFieldDecorator("tipo", { initialValue: endereco.tipo })(
                        <Select>
                            <Select.Option value="comercial">
                                Comercial
                            </Select.Option>
                            <Select.Option value="residencial">
                                Residencial
                            </Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("logradouro", {
                        initialValue: endereco.logradouro
                    })(<Input placeholder="Logradouro" />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("numero", {
                        initialValue: endereco.numero
                    })(<Input placeholder="Número" />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("complemento", {
                        initialValue: endereco.complemento
                    })(<Input placeholder="Complemento" />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("bairro", {
                        initialValue: endereco.bairro
                    })(<Input placeholder="Bairro" />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("cidade", {
                        initialValue: endereco.cidade
                    })(<Input placeholder="Cidade" />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("estado", {
                        initialValue: endereco.estado
                    })(<Input placeholder="Estado" />)}
                </Form.Item>
            </Form>
        );
    }
}

export default (Form.create as any)()(EnderecoForm) as React.ComponentClass<
    EnderecoProps
>;
