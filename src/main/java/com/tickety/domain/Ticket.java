package com.tickety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tickety.domain.enumeration.TicketStatus;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ticket.
 */
@Entity
@Table(name = "ticket")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ticket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_status")
    private TicketStatus ticketStatus;

    @Column(name = "payment")
    private String payment;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "seat")
    private String seat;

    @JsonIgnoreProperties(value = { "events", "roles", "ticket", "organization" }, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ACCOUNT_ID")
    private UserAccount userAccount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "galery", "artists", "tickets", "userAccount", "organization", "venue" }, allowSetters = true)
    private Event event;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getPayment() {
        return payment;
    }

    public Long getAmount() {
        return amount;
    }

    public String getSeat() {
        return seat;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public Ticket payment(String payment) {
        this.setPayment(payment);
        return this;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public Ticket amount(Long amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Ticket seat(String seat) {
        this.setSeat(seat);
        return this;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public Long getId() {
        return this.id;
    }

    public Ticket id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Ticket date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TicketStatus getTicketStatus() {
        return this.ticketStatus;
    }

    public Ticket ticketStatus(TicketStatus ticketStatus) {
        this.setTicketStatus(ticketStatus);
        return this;
    }

    public void setTicketStatus(TicketStatus ticketStatus) {
        this.ticketStatus = ticketStatus;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Ticket event(Event event) {
        this.setEvent(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ticket)) {
            return false;
        }
        return id != null && id.equals(((Ticket) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ticket{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", ticketStatus='" + getTicketStatus() + "'" +
            ", payment='" + getPayment() + "'" +
            ", amount=" + getAmount() +
            ", seat='" + getSeat() + "'" +
            "}";
    }
}
