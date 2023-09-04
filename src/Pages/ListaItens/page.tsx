"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeaderListaItens } from "./Header";
import styles from "./styles.module.scss";
import { AgGridReact } from "ag-grid-react";
import { api } from "@/services/api/axios";
import { AG_GRID_LOCALE_PT_BR } from "@/helpers/agGridPtBR";
import ModalAdicionarItem from "./ModalAdicionarItem";
import { Button } from "@mui/material";
import { MdAddCircle } from "react-icons/md";
import { useGetInfosUser } from "@/hooks/useGetInfosUser";

type itensEstoqueType = {
  itemId: number;
  nomeItem: string;
  dataCriacao: string;
  valorItem: string;
  idUsuarioCriador: number;
  nomeUsuarioCriador: string;
};

export function ListaItensComponent() {
  const gridRef = useRef(null);
  const { getDataUsuario } = useGetInfosUser();
  const [itensEstoque, setItensEstoque] = useState<itensEstoqueType[]>([]);
  const [selectedRow, setSelectedRow] = useState<itensEstoqueType>();
  const [openModalAdicionarItem, setOpenModalAdicionarItem] = useState(false);

  const cellStyle = (params: any) => {
    return {
      borderBottom: "1px solid rgb(220,220,220)",
      fontSize: "9pt",
    };
  };

  const [columnDefs, setColumnDefs] = useState<any>([
    {
      headerName: "N° Item",
      field: "idItem",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "200px",
    },
    {
      headerName: "Item",
      field: "nomeItem",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "400px",
    },
    {
      headerName: "Descrição",
      field: "descricaoItem",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "500px",
    },
    {
      headerName: "Valor Item (R$)",
      field: "valorItem",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "250px",
      cellRenderer: (params: any) => {
        const valor = params.value.replace(".", ",") || "0";

        return (
          <span
            style={{
              color: "rgb(122, 168, 116)",
              fontWeight: "bold",
            }}
          >
            R$ {valor.split(",")[1] ? valor : valor + ",00"}
          </span>
        );
      },
    },
    {
      headerName: "Data Criação",
      field: "dataCriacao",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "250px",
      cellRenderer: (params: any) => {
        const valor = params.value || "";
        return new Date(valor).toLocaleDateString();
      },
    },
    {
      headerName: "Usuário",
      field: "nomeUsuarioCriador",
      resizable: true,
      filter: true,
      sortable: true,
      cellStyle: cellStyle,
      headerClass: "headerTable",
      width: "250px",
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  const cellClickedListener = useCallback((event: any) => {
    console.log("cellClicked", event.data);
    setSelectedRow(event.data);
  }, []);

  useEffect(() => {
    getDataUsuario();
    listarIntensEstoque();
  }, []);

  async function listarIntensEstoque() {
    const itensResponse = await api.get("itens/listar");
    if (itensResponse.data) setItensEstoque(itensResponse.data);
  }
  function atualizarListagem(value: itensEstoqueType) {
    setItensEstoque([...itensEstoque, value]);
  }

  return (
    <>
      <ModalAdicionarItem
        atualizarListagem={atualizarListagem}
        openModal={openModalAdicionarItem}
        setOpenModal={setOpenModalAdicionarItem}
      />
      <HeaderListaItens />
      <main className={styles.main}>
        <div className={styles.containerButtonAdd}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenModalAdicionarItem(true);
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <MdAddCircle size={18} /> Adicionar
            </div>
          </Button>
        </div>
        <div className={`${styles.containerTable} ag-theme-alpine`}>
          <AgGridReact
            ref={gridRef}
            rowData={itensEstoque}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="single"
            localeText={AG_GRID_LOCALE_PT_BR}
            onCellClicked={cellClickedListener}
          />
        </div>
      </main>
    </>
  );
}
