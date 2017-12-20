import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { fetch } from "../Utils";
import Row from "antd/lib/Row";
import Col from "antd/lib/Col";
import Icon from "antd/lib/Icon";
import Input from "antd/lib/Input";
import Modal from "antd/lib/Modal";
import Button from "antd/lib/Button";
import Select from "antd/lib/Select";
import { formatEndereco } from "../Utils";
import * as Models from "../store/Models";
import * as Pessoas from "../store/Pessoas";
import EnderecoForm from "./EnderecoForm";

type RouteProps = RouteComponentProps<{ id?: number }>;
type DispatchProps = typeof Pessoas.actionCreators;
type PessoasListProps = DispatchProps & RouteProps;

interface PessoasFormState {
    visible: boolean;
    model: Models.Pessoa;
    marcadores: string[];
    currentEndereco: Models.Endereco | null;
}

const emptyPessoa = {
    nome: "",
    contatos: [],
    enderecos: [],
    marcadores: []
};

@(connect as any)(null, Pessoas.actionCreators)
export default class PessoasList extends React.Component<
    PessoasListProps,
    PessoasFormState
> {
    private readonly title: string;
    private readonly modelId: number | undefined;
    public enderecoForm: any;

    constructor(props: PessoasListProps) {
        super(props);

        this.modelId = this.props.match.params.id;
        this.title = this.modelId ? "Editar Pessoa" : "Nova Pessoa";

        this.state = {
            visible: false,
            marcadores: [],
            currentEndereco: null,
            model: { ...emptyPessoa }
        };
    }

    componentWillMount() {
        if (this.modelId) {
            fetch(`/api/pessoas/${this.modelId}`, undefined, true)
                .then(r => r.json())
                .then(model => {
                    this.setState({ model });
                });
        }
        fetch("/api/marcadores", undefined, true)
            .then(r => r.json())
            .then(marcadores => {
                this.setState({ marcadores });
            });
    }

    create = () => {
        const { model } = this.state;
        fetch(`/api/pessoas`, {
            method: "POST",
            body: JSON.stringify(model),
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            this.props.history.push("/");
        });
    };

    update = () => {
        const { model } = this.state;
        fetch(`/api/pessoas/${model.id}`, {
            method: "PUT",
            body: JSON.stringify(model),
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            this.props.history.push("/");
        });
    };

    handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();

        if (this.modelId) {
            this.update();
        } else {
            this.create();
        }
    };

    enderecoFormRef = (e: any) => {
        this.enderecoForm = e;
    };

    onChangeNome = (e: React.ChangeEvent<{ value: string }>) => {
        const { model } = this.state;
        this.setState({ model: { ...model, nome: e.target.value } });
    };

    onChangeContato = (
        index: number,
        prop: keyof Models.Contato,
        value: any
    ) => {
        const { model } = this.state;
        const contatos = model.contatos.slice(0);
        contatos[index][prop] = value;

        this.setState({ model: { ...model, contatos } });
    };

    onChangeMarcadores = (values: any) => {
        const distinct = new Set(values);
        const marcadores = Array.from(distinct.values()) as string[];
        this.setState({ model: { ...this.state.model, marcadores } });
    };

    addContato = () => {
        this.setState({
            model: {
                ...this.state.model,
                contatos: this.state.model.contatos.concat({
                    tipo: "comercial",
                    valor: ""
                })
            }
        });
    };

    removeContato = (index: number) => (e: any) => {
        const { model } = this.state;
        this.setState({
            model: {
                ...model,
                contatos: model.contatos
                    .slice(0, index)
                    .concat(model.contatos.slice(index + 1))
            }
        });
    };

    addEndereco = () => {
        this.setState({
            visible: true,
            currentEndereco: {
                tipo: "residencial",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: ""
            }
        });
    };

    removeEndereco = (index: number) => (e: any) => {
        const { model } = this.state;
        this.setState({
            model: {
                ...model,
                enderecos: model.enderecos
                    .slice(0, index)
                    .concat(model.enderecos.slice(index + 1))
            }
        });
    };

    onSaveEndereco = async () => {
        const { model } = this.state;
        const endereco = (await this.enderecoForm.submitForm()) as Models.Endereco;

        this.setState({
            visible: false,
            currentEndereco: null,
            model: { ...model, enderecos: model.enderecos.concat(endereco) }
        });
    };

    closeModal = () => {
        this.setState({
            visible: false,
            currentEndereco: null
        });
    };

    render() {
        const { model, visible, currentEndereco } = this.state;
        return (
            <div>
                <h1>{this.title}</h1>
                <form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={3} className="field-label">
                            <label>Nome</label>
                        </Col>
                        <Col span={21} className="field-input">
                            <Input
                                placeholder="Nome"
                                value={model.nome}
                                onChange={this.onChangeNome}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="field-label">
                            <label>Marcadores</label>
                        </Col>
                        <Col span={21} className="field-input">
                            <Select
                                mode="tags"
                                placeholder="Marcadores"
                                value={model.marcadores}
                                onChange={this.onChangeMarcadores}
                            >
                                {this.state.marcadores.map(m => (
                                    <Select.Option key={m} value={m}>
                                        {m}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <fieldset>
                        <legend>Contatos</legend>
                        {model.contatos.map((contato, index) => (
                            <Row key={index}>
                                <Col span={23}>
                                    <Input.Group compact>
                                        <Select
                                            style={{ width: "40%" }}
                                            value={contato.tipo}
                                            onChange={value =>
                                                this.onChangeContato(
                                                    index,
                                                    "tipo",
                                                    value
                                                )
                                            }
                                        >
                                            <Select.Option value="email">
                                                E-mail
                                            </Select.Option>
                                            <Select.Option value="comercial">
                                                Fone Comercial
                                            </Select.Option>
                                            <Select.Option value="residencial">
                                                Fone Residencial
                                            </Select.Option>
                                        </Select>
                                        <Input
                                            placeholder="Valor"
                                            style={{ width: "60%" }}
                                            value={contato.valor}
                                            onChange={e =>
                                                this.onChangeContato(
                                                    index,
                                                    "valor",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Input.Group>
                                </Col>
                                <Col
                                    span={1}
                                    style={{
                                        textAlign: "center",
                                        paddingTop: "5px"
                                    }}
                                >
                                    <a onClick={this.removeContato(index)}>
                                        <Icon type="minus-circle-o" />
                                    </a>
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col span={24}>
                                <Button
                                    type="dashed"
                                    style={{ width: "100%" }}
                                    onClick={this.addContato}
                                >
                                    <Icon type="plus" /> Adicionar contato
                                </Button>
                            </Col>
                        </Row>
                    </fieldset>
                    <fieldset>
                        <legend>Endereços</legend>
                        {model.enderecos.map((endereco, index) => (
                            <div key={index}>
                                <Row>
                                    <Col span={23}>
                                        <Input.Group compact>
                                            <Select
                                                disabled
                                                style={{ width: "40%" }}
                                                value={endereco.tipo}
                                            >
                                                <Select.Option value="email">
                                                    E-mail
                                                </Select.Option>
                                                <Select.Option value="comercial">
                                                    Fone Comercial
                                                </Select.Option>
                                                <Select.Option value="residencial">
                                                    Fone Residencial
                                                </Select.Option>
                                            </Select>
                                            <Input
                                                readOnly
                                                style={{ width: "60%" }}
                                                value={formatEndereco(endereco)}
                                            />
                                        </Input.Group>
                                    </Col>
                                    <Col
                                        span={1}
                                        style={{
                                            textAlign: "center",
                                            paddingTop: "5px"
                                        }}
                                    >
                                        <a onClick={this.removeEndereco(index)}>
                                            <Icon type="minus-circle-o" />
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Row>
                            <Col span={24}>
                                <Button
                                    type="dashed"
                                    style={{ width: "100%" }}
                                    onClick={this.addEndereco}
                                >
                                    <Icon type="plus" /> Adicionar endereço
                                </Button>
                            </Col>
                        </Row>
                    </fieldset>
                    <Row type="flex" justify="end">
                        <Button type="primary" onClick={this.handleSubmit}>
                            <Icon type="save" /> Salvar
                        </Button>
                    </Row>
                    <Modal
                        title="Adicionar Endereço"
                        onOk={this.onSaveEndereco}
                        onCancel={this.closeModal}
                        visible={visible}
                    >
                        {currentEndereco && (
                            <EnderecoForm
                                endereco={currentEndereco}
                                formRef={this.enderecoFormRef}
                            />
                        )}
                    </Modal>
                </form>
            </div>
        );
    }
}
