import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { fetch } from "../Utils";
import Row from "antd/lib/Row";
import Col from "antd/lib/Col";
import Tag from "antd/lib/Tag";
import Icon from "antd/lib/Icon";
import Table, { TableProps, ColumnProps } from "antd/lib/Table";
import { ApplicationState } from "../store";
import { formatEndereco } from "../Utils";
import * as Models from "../store/Models";
import * as Pessoas from "../store/Pessoas";

type RouteProps = RouteComponentProps<{}>;
type DispatchProps = typeof Pessoas.actionCreators;
type PessoasListProps = Pessoas.PessoasState & DispatchProps & RouteProps;

const mapStateToProps = (
    state: ApplicationState,
    ownProps: RouteComponentProps<{}>
): Pessoas.PessoasState => ({ ...state.pessoas });

const PessoaTable = Table as {
    new (props: TableProps<Models.Pessoa>): Table<Models.Pessoa>;
};

@(connect as any)(mapStateToProps, Pessoas.actionCreators)
export default class PessoasList extends React.Component<
    PessoasListProps,
    { marcadores: string[] }
> {
    constructor(props: PessoasListProps) {
        super(props);

        this.state = {
            marcadores: []
        };
    }

    showEndereco = (endereco: Models.Endereco) => {
        return (
            <Row key={endereco.id}>
                <Col span={6}>
                    <b>{endereco.tipo}</b>
                </Col>
                <Col span={18}>{formatEndereco(endereco)}</Col>
            </Row>
        );
    };

    showContato = (contato: Models.Contato) => {
        return (
            <Row key={contato.id}>
                <Col span={6}>
                    <b>{contato.tipo}</b>
                </Col>
                <Col span={18}>{contato.valor}</Col>
            </Row>
        );
    };

    showDetails = (item: Models.Pessoa) => {
        return (
            <Row>
                <Col span={24}>{item.enderecos.map(this.showEndereco)}</Col>
                <Col span={24}>{item.contatos.map(this.showContato)}</Col>
            </Row>
        );
    };

    componentWillMount() {
        this.props.fetchPessoas();
        fetch("/api/marcadores", undefined, true)
            .then(r => r.json())
            .then(marcadores => this.setState({ marcadores }));
    }

    render() {
        const { removePessoa } = this.props;
        const columns: ColumnProps<Models.Pessoa>[] = [
            {
                key: "name",
                title: "Nome",
                dataIndex: "nome",
                sorter(item1, item2) {
                    return item1.nome.localeCompare(item2.nome);
                }
            },
            {
                key: "tags",
                title: "Marcadores",
                filters: this.state.marcadores.map(m => ({
                    text: m,
                    value: m
                })),
                onFilter(value, item) {
                    return item.marcadores.some(m => m === value);
                },
                render(text, item, index) {
                    return item.marcadores.map(m => <Tag key={m}>{m}</Tag>);
                }
            },
            {
                key: "actions",
                title: "Ações",
                render(text, item, index) {
                    return [
                        <Link key="edit" to={`/edit/${item.id}`}>
                            <Icon type="edit" />
                        </Link>,
                        <a
                            key="delete"
                            onClick={e => {
                                e.stopPropagation();
                                if (item.id) removePessoa(item.id);
                            }}
                            className="agenda-action"
                        >
                            <Icon type="delete" />
                        </a>
                    ];
                }
            }
        ];

        return (
            <div>
                <h1>Lista de Pessoas</h1>
                <Row type="flex" justify="end" align="middle">
                    <Link to="/create" className="ant-btn ant-btn-primary">
                        <Icon type="user-add" /> Nova Pessoa
                    </Link>
                </Row>
                <PessoaTable
                    rowKey="id"
                    pagination={false}
                    columns={columns}
                    dataSource={this.props.data}
                    expandedRowRender={this.showDetails}
                />
            </div>
        );
    }
}
