"use client";

import { useEffect, useRef } from "react";
import "tui-grid/dist/tui-grid.css";
import fetchWithRetry from "../../functions/api";

class CustomCheckBoxRenderer {
    constructor(props) {
        this.el = document.createElement("input");
        this.el.type = "checkbox";
        this.el.onclick = () => {
            props.columnInfo.renderer.options.onClick(
                props.grid.getRow(props.rowKey), this.el.checked
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


export default function ManagementForm({users}) {
    const gridRef = useRef();

    const handleEditProviderAuth = async (user, isChecked) => {
        const formData = new FormData();

        formData.append("isProvider", isChecked);
        await fetchWithRetry(`/user/${user.id}/provider`, {
            method: "PUT",
            body: formData
        });
    }

    const handleEditAdminAuth = async (user, isChecked) => {
        const formData = new FormData();

        formData.append("isAdmin", isChecked);
        await fetchWithRetry(`/user/${user.id}/admin`, {
            method: "PUT",
            body: formData
        });
    }

    const getGrid = async () => {
        const Grid = (await import("tui-grid")).default;

        if (!gridRef.current.instance) {
            const grid = new Grid({
                el: gridRef.current,
                bodyHeight: "fitToParent",
                columns: [{
                    header: "닉네임",
                    name: "nick",
                },
                {
                    header: "이메일",
                    name: "email",
                },
                {
                    header: "제작자",
                    name: "provider",
                    width: 120,
                    align: "center",
                    renderer: {
                        type: CustomCheckBoxRenderer,
                        options: {
                            onClick: handleEditProviderAuth,
                        },
                    },
                }, {
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
                ],
                data: users,
            });

            gridRef.current.instance = grid;
        }
    }

    useEffect(() => {
        getGrid();
    }, []);

    return <>
        <div ref={gridRef} />
    </>
}