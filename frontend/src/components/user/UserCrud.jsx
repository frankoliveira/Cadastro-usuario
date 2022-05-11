import React, {Component} from "react";
import Main from "../template/Main";
import axios from "axios";

const headerProps = {
    icon: "users",
    title: "Usuários",
    subtitle: "Cadastro de usuários: Incluir, Listar, Alterar e Excluir"
}

const baseURL = 'http://localhost:3001/users'

const initialState = {
    user: {name: '', email: ''},
    list: []
}

export default class UserCrud extends Component {
    state = {...initialState}

    componentWillMount(){
        //faz um get na url
        axios(baseURL).then(resp => {
            this.setState({list: resp.data})
        })
    }

    clear(){
        this.setState({ user: initialState.user})
    }

    save(){
        const user = this.state.user
        //put para alterar, post para inserir um novo

        const method = user.id ? 'put' : 'post'
        //altera caso haja especificação do id/ cria um novo na url padrão

        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list})
            })
    }

    getUpdatedList(user, add = true){
        //cria uma nova lista sem o usuário adicionado/alterado
        const list = this.state.list.filter(u => u.id !== user.id)
        //insere no início se u usuário tiver sido passado como parâmetro
        if(add) list.unshift(user)
        return list
    }

    updateField(event){
        //clonando o usuário
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        //equivale a this.setState({user: user})
        this.setState({user})
    }

    renderForm(){
        return (
            <div className="form">
                <dib className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text"
                                className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text"
                                className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail"/>
                        </div>
                    </div>
                </dib>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user){
        this.setState({user})
    }

    remove(user){
        axios.delete(`${baseURL}/${user.id}`).then(resp => {
            //retorna a lista atualizada sem adicionar nenhum novo elemento
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning"
                        onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                        onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render(){
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}