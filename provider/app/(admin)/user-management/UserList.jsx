"use client";

import { setGrantAdmin, setGrantProvider } from "@/app/actions/account";
import { ProfileLink } from "@/components/datagrid/Link";
import { useEffect, useRef } from "react";
import Grid from "tui-grid";
import "tui-grid/dist/tui-grid.css";

class CustomCheckBoxRenderer {
  constructor(props) {
    this.el = document.createElement("input");
    this.el.type = "checkbox";
    this.el.onclick = () => {
      props.columnInfo.renderer.options.onClick(
        props.grid.getRow(props.rowKey),
        this.el.checked
      );
    };
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.checked = props.value;
  }
}

export default function UserList({ users }) {
  const gridRef = useRef();
  const providerFormRef = useRef();
  const adminFormRef = useRef();

  const handleEditProviderAuth = async (user, checked) => {
    const { userId, grant } = providerFormRef.current;

    userId.value = user.id;
    grant.value = checked;

    providerFormRef.current.requestSubmit();
  };

  const handleEditAdminAuth = async (user, checked) => {
    const { userId, grant } = adminFormRef.current;

    userId.value = user.id;
    grant.value = checked;

    adminFormRef.current.requestSubmit();
  };

  const handleGrantProvider = async (providerFormData) => {
    try {
      await setGrantProvider({
        id: providerFormData.get("userId"),
        granted: providerFormData.get("grant"),
      });

      providerFormData.set("userId", "");
      providerFormData.set("grant", "");
    } catch ({ message }) {
      alert(message);
    }
  };

  const handleGrantAdmin = async (adminFormData) => {
    try {
      await setGrantAdmin({
        id: adminFormData.get("userId"),
        granted: adminFormData.get("grant"),
      });

      adminFormData.set("userId", "");
      adminFormData.set("grant", "");
    } catch ({ message }) {
      alert(message);
    }
  };

  const getGrid = () => {
    if (!gridRef.current.instance) {
      const grid = new Grid({
        el: gridRef.current,
        bodyHeight: "fitToParent",
        columns: [
          {
            header: "닉네임",
            name: "nick",
            renderer: {
              type: ProfileLink,
              options: {
                path: "profile",
                text: "nick",
              },
            },
            filter: "text",
            sortable: true,
            sortingType: "desc",
          },
          {
            header: "이메일",
            name: "email",
            filter: "text",
            sortable: true,
            sortingType: "desc",
          },
          {
            header: "프로바이더",
            name: "provider",
            width: 120,
            align: "center",
            renderer: {
              type: CustomCheckBoxRenderer,
              options: {
                onClick: handleEditProviderAuth,
              },
            },
            sortable: true,
            sortingType: "desc",
          },
          {
            header: "관리자",
            name: "admin",
            width: 120,
            align: "center",
            renderer: {
              type: CustomCheckBoxRenderer,
              options: {
                onClick: handleEditAdminAuth,
              },
            },
            sortable: true,
            sortingType: "desc",
          },
        ],
        data: users,
      });

      gridRef.current.instance = grid;
    }
  };

  useEffect(() => {
    getGrid();
  }, []);

  return (
    <>
      <div className="grid">
        <div ref={gridRef} />
      </div>
      <form ref={providerFormRef} action={handleGrantProvider}>
        <input type="hidden" name="userId" />
        <input type="hidden" name="grant" />
      </form>
      <form ref={adminFormRef} action={handleGrantAdmin}>
        <input type="hidden" name="userId" />
        <input type="hidden" name="grant" />
      </form>
    </>
  );
}
