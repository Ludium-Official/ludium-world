"use client";

import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
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

class CustomLink {
  constructor(props) {
    const { path } = props.columnInfo.renderer.options;
    const { id } = props.grid.getRow(props.rowKey);
    this.el = document.createElement("a");
    this.el.href = `/${path}/${id}`;

    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerText = "보러가기";
  }
}

export default function UserList({ users }) {
  const gridRef = useRef();
  const router = useRouter();

  const handleEditProviderAuth = async (user, isChecked) => {
    await fetchWithRetry(`/user/${user.id}/provider?isProvider=${isChecked}`, {
      method: "PUT",
    });
  };

  const handleEditAdminAuth = async (user, isChecked) => {
    await fetchWithRetry(`/user/${user.id}/admin?isAdmin=${isChecked}`, {
      method: "PUT",
    });
  };

  const handleRouterProfile = (user) => {
    router.push(`/profile/${user.id}`);
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
          },
          {
            header: "이메일",
            name: "email",
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
          },
          {
            header: "프로필",
            name: "profile",
            width: 120,
            align: "center",
            renderer: {
              type: CustomLink,
              options: {
                path: "profile",
              },
            },
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
    <div className="grid">
      <div ref={gridRef} />
    </div>
  );
}
