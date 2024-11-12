defmodule ElixWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", ElixWeb.RoomChannel

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
