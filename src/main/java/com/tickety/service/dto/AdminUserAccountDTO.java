package com.tickety.service.dto;

import com.tickety.domain.User;
import com.tickety.domain.UserAccount;

public class AdminUserAccountDTO extends AdminUserDTO {

    private UserAccount userAccount;

    public AdminUserAccountDTO() {
        super();
    }

    public AdminUserAccountDTO(User user) {
        super(user);
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    @Override
    public String toString() {
        return "AdminUserAccountDTO{" + "userAccount=" + userAccount.toString() + '}';
    }
}
