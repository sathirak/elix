defmodule ElixWeb.Api.UserController do
  use ElixWeb, :controller

  # Define an index action for your API
  def index(conn, _params) do
    # Example response
    users = [%{id: 1, name: "John"}, %{id: 2, name: "Jane"}]
    json(conn, users)
  end

  # Define a show action for your API
  def show(conn, %{"id" => id}) do
    user = %{id: id, name: "User #{id}"}
    json(conn, user)
  end
end
