let EstagioSelecionado;
const getmenuEstagio = async (menuEstagio) => {
  console.log(menuEstagio, "menu estagio entrou");
  if (menuEstagio === "1") {
    EstagioSelecionado = "LAVAGEM";
    return EstagioSelecionado;
  } else if (menuEstagio === "2") {
    EstagioSelecionado = "POLIMENTO TECNICO";
    return EstagioSelecionado;
  }else if (menuEstagio === "3") {
    EstagioSelecionado = "DESMONTAGEM";
    return EstagioSelecionado;
  }else if (menuEstagio === "4") {
    EstagioSelecionado = "LANTERNAGEM";
    return EstagioSelecionado;
  }else if (menuEstagio === "5") {
    EstagioSelecionado = "PREPARACAO";
    return EstagioSelecionado;
  }else if (menuEstagio === "6") {
    EstagioSelecionado = "PINTURA";
    return EstagioSelecionado;
  }else if (menuEstagio === "7") {
    EstagioSelecionado = "MONTAGEM";
    return EstagioSelecionado;
  }else if (menuEstagio === "8") {
    EstagioSelecionado = "POLIMENTO FINAL";
    return EstagioSelecionado;
  }
  
};

module.exports = getmenuEstagio;
